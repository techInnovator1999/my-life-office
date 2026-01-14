import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import ms, { StringValue } from 'ms';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { RoleEnum } from 'src/roles/roles.enum';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { AuthProvidersEnum } from './auth-providers.enum';
import { SocialInterface } from '../social/interfaces/social.interface';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { AuthCrmRegisterDto } from './dto/auth-crm-register.dto';
import { MailService } from 'src/mail/mail.service';
import { NullableType } from '../utils/types/nullable.type';
import { LoginResponseType } from './types/login-response.type';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { User } from 'src/users/domain/user';
import { Session } from 'src/session/domain/session';
import { UsersService } from 'src/users/users.service';
import { SessionService } from 'src/session/session.service';
import { fetchEntity } from '@/utils/fetch-entity-helper';
import { In } from 'typeorm';
import { RedirectToUser } from './dto/redirectToUser.dto';
import { PushNotificationService } from '@/notification/push.notification.service';
import { PushNotificationType } from '@/notification/push.notification.enum';
import { randomUUID } from 'node:crypto';
import { StatusEnum as StatusesEnum } from '@/statuses/statuses.enum';
import { generatePassword } from '@/utils/util.helper';
import { AccountManagerService } from '@/account-manager/account-manager.service';
import { AccountManagerDto } from '@/account-manager/dto/create-account-manager.dto';
import { AccountManager } from '@/account-manager/domain/account-manager';
import { AccountManagerStatusEnum } from '@/users/users.enum';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private sessionService: SessionService,
    private mailService: MailService,
    private accountManagerService: AccountManagerService,
    private configService: ConfigService<AllConfigType>,
    private pushNotificationService: PushNotificationService,
  ) {}

  async validateLogin(
    loginDto: AuthEmailLoginDto,
    isLoginWithToken: boolean = false,
    roleId: string[],
  ): Promise<LoginResponseType> {
    let user;
    try {
      user = await fetchEntity(this.usersService, 'User', {
        email: loginDto.email,
        role: { id: In(roleId) },
      });
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          message: 'Your email is not recognized. Please create a new account.',
        },
        HttpStatus.CONFLICT,
      );
    }

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Your email is not recognized. Please create a new account.',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (user.deactivatedAt && user.deactivatedAt < new Date()) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'User is deactivated',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const isSuspended = await this.usersService.isUserSuspended(user.id);
    if (isSuspended) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'You are suspended',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    if (!isLoginWithToken) {
      if (user.provider !== AuthProvidersEnum.email) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            message: `Need login via provider:${user.provider}`,
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      if (!user.password) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'Incorrect password',
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      const isValidPassword = await bcrypt.compare(
        loginDto?.password ?? '',
        user.password,
      );

      if (!isValidPassword) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'Incorrect password',
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (user.status.id === StatusEnum.INACTIVE) {
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();

      await this.usersService.update(user.id, {
        verificationCode,
        verificationExpires: new Date(Date.now() + 3600000), // 1 hour expiry
      });

      // if (user.role.id === RoleEnum.PARTNER) {
      //   await this.mailService.partnerSignUp({
      //     to: user.email,
      //     data: {
      //       verificationCode,
      //       userName: user.firstName + ' ' + user.lastName,
      //     },
      //   });
      // } else {
      await this.mailService.userSignUp({
        to: user.email,
        data: {
          verificationCode,
          userName: user.firstName + ' ' + user.lastName,
        },
      });
      // }

      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message:
            'Your account is registered but not verified. Please check your email for the verification code and complete the verification process.',
          data: {
            verificationRequired: true,
          },
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const session = await this.sessionService.create({
      user,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      role: user.role,
      sessionId: session.id,
    });

    const userDevicePayload = {
      user: user.id,
      deviceId: loginDto.deviceId ?? randomUUID(),
      language: loginDto.language ?? 1,
      fcmToken: loginDto.fcmToken ?? '',
    };
    await this.usersService.createUserDevice(userDevicePayload);
    await this.usersService.update(user.id, { lastLogin: new Date() });

    if (user.status && user.status.id === StatusesEnum.ABANDONED) {
      await this.usersService.update(user.id, {
        status: { id: StatusesEnum.ACTIVE },
        deactivatedAt: null,
        deactivatedReason: null,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, previousPassword, ...sanitizedUser } = user;

    return {
      refreshToken,
      token,
      tokenExpires,
      user: sanitizedUser,
    };
  }

  async validateLoginWithToken(jwtData: any) {
    const loginResponse = await this.validateLogin(
      { email: jwtData.email },
      true,
      [RoleEnum.CLIENT],
    );

    return loginResponse;
  }

  async sessionDelete(userJwtPayload: JwtPayloadType): Promise<boolean> {
    try {
      await this.sessionService.softDelete({
        user: {
          id: userJwtPayload.id,
        },
        excludeId: userJwtPayload.sessionId,
      });
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Deletion failed',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return true;
  }

  async loginWithToken(token: string): Promise<any> {
    let jwtData;
    try {
      jwtData = await this.jwtService.verify<{
        token;
      }>(token, {
        secret: this.configService.getOrThrow('auth.secret', {
          infer: true,
        }),
      });
      console.log(jwtData);
      // userId = jwtData.forgotUserId;
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Invalid hash',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return await this.validateLoginWithToken(jwtData);
  }

  async generateTokenByUserId(userId: string): Promise<RedirectToUser> {
    const user = await fetchEntity(this.usersService, 'User', {
      id: userId,
    });
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });
    const accessToken = await this.jwtService.signAsync(
      {
        id: userId,
        email: user?.email,
      },
      {
        secret: this.configService.getOrThrow('auth.secret', { infer: true }),
        expiresIn: tokenExpiresIn,
      },
    );

    return { accessToken };
  }

  async validateSocialLogin(
    authProvider: string,
    socialData: SocialInterface,
  ): Promise<LoginResponseType> {
    let user: NullableType<User> = null;
    const socialEmail = socialData.email?.toLowerCase();
    let userByEmail: NullableType<User> = null;

    if (socialEmail) {
      userByEmail = await this.usersService.findOne({
        email: socialEmail,
      });
    }

    if (socialData.id) {
      user = await this.usersService.findOne({
        socialId: socialData.id,
        provider: authProvider,
      });
    }

    if (user) {
      if (socialEmail && !userByEmail) {
        user.email = socialEmail;
      }
      await this.usersService.update(user.id, user);
    } else if (userByEmail) {
      user = userByEmail;
    } else {
      const role = {
        id: RoleEnum.CLIENT,
      };
      const status = {
        id: StatusEnum.ACTIVE,
      };

      user = await this.usersService.create(
        {
          email: socialEmail ?? null,
          firstName: socialData.firstName ?? null,
          lastName: socialData.lastName ?? null,
          socialId: socialData.id,
          provider: authProvider,
          role,
          status,
          isApproved: false,
          referralName: undefined,
        },
        RoleEnum.CLIENT,
      );

      user = await this.usersService.findOne({
        id: user?.id,
      });
    }

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'User not found',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const session = await this.sessionService.create({
      user,
    });

    const {
      token: jwtToken,
      refreshToken,
      tokenExpires,
    } = await this.getTokensData({
      id: user.id,
      role: user.role,
      sessionId: session.id,
    });

    return {
      refreshToken,
      token: jwtToken,
      tokenExpires,
      user,
    };
  }

  async register(
    dto: AuthRegisterLoginDto,
    roleId: string = RoleEnum.CLIENT,
  ): Promise<User> {
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const user = await this.usersService.create(
      {
        ...dto,
        email: dto.email,
        role: {
          id: roleId,
        },
        status: {
          id: StatusEnum.INACTIVE,
        },
        reference_code: dto.reference_code,
        isApproved: false,
        referralName: dto.referralName,
        verificationCode,
        verificationExpires: new Date(Date.now() + 3600000),
      },
      roleId,
      roleId == RoleEnum.CLIENT ? true : undefined,
    );

    const lapSupport = this.configService.getOrThrow('app.lapSupport', {
      infer: true,
    });
    if (roleId != RoleEnum.ACCOUNT_MANAGER) {
      // let url;

      // if (roleId == RoleEnum.PARTNER) {
      //   await this.mailService.partnerSignUp({
      //     to: dto.email,
      //     data: {
      //       verificationCode,
      //       userName: user.firstName + ' ' + user.lastName,
      //     },
      //   });
      // } else {
      await this.mailService.userSignUp({
        to: dto.email,
        data: {
          verificationCode,
          userName: user.firstName + ' ' + user.lastName,
        },
      });
      // }
    }
    if (roleId === RoleEnum.CLIENT) {
      await this.pushNotificationService.SendPushNotificationAsync(
        PushNotificationType.NewUserRegistered,
        null,
        user,
      );
      await this.mailService.AdminNotify({
        to: lapSupport,
        data: {
          email: dto.email,
          userName: user.firstName + ' ' + user.lastName,
          referalCode: user.reference_code ?? null,
          referalPartnerName: null,
          heardBy: dto.heardBy ?? 'Not Specified',
          referralName: dto.referralName ?? 'Not Specified',
          type: !user.reference_code ? '- Direct' : '- Direct',
        },
      });
    }
    return user;
  }

  async crmRegister(dto: AuthCrmRegisterDto): Promise<User> {
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // Validate sponsoringAgentId if provided
    if (dto.sponsoringAgentId) {
      const sponsoringAgent = await this.usersService.findOne({
        id: dto.sponsoringAgentId,
        role: { id: RoleEnum.AGENT },
      });
      if (!sponsoringAgent) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'Invalid sponsoring agent',
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    const user = await this.usersService.create(
      {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: dto.password,
        role: {
          id: RoleEnum.AGENT,
        },
        status: {
          id: StatusEnum.INACTIVE,
        },
        isApproved: false,
        verificationCode,
        verificationExpires: new Date(Date.now() + 3600000),
        // CRM-specific fields
        mobile: dto.mobile,
        registrationType: dto.registrationType,
        primaryLicenseType: dto.primaryLicenseType,
        residentState: dto.residentState,
        licenseNumber: dto.licenseNumber,
        yearsLicensed: dto.yearsLicensed,
        priorProductsSold: dto.priorProductsSold,
        currentCompany: dto.currentCompany,
        sponsoringAgentId: dto.sponsoringAgentId,
        referralName: undefined,
        crmAgent: true, // Set to true for CRM agent registrations
      },
      RoleEnum.AGENT,
    );

    // Send CRM agent registration email (non-blocking - don't fail registration if email fails)
    this.mailService.crmAgentSignUp({
      to: dto.email,
      data: {
        verificationCode,
        userName: user.firstName + ' ' + user.lastName,
      },
    }).catch((error) => {
      console.error('Failed to send CRM agent signup email:', error);
      console.error('Verification code for', dto.email, ':', verificationCode);
      console.error('Please configure SMTP settings in .env file to enable email sending.');
      // Log error but don't fail registration
    });

    // In development, log verification code for testing
    if (process.env.NODE_ENV === 'development') {
      console.log('=== CRM REGISTRATION SUCCESS ===');
      console.log('Email:', dto.email);
      console.log('Verification Code:', verificationCode);
      console.log('Note: Configure SMTP settings to receive emails');
      console.log('===============================');
    }

    return user;
  }

  async confirmEmail(code: string, email: string): Promise<any> {
    const user = await this.usersService.findOne({ email });

    if (!user) {
      throw new HttpException(
        {
          status: false,
          message: 'User not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (!user.verificationCode || !user.verificationExpires) {
      throw new HttpException(
        {
          status: false,
          message: 'Verification code not found or expired',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (new Date() > new Date(user.verificationExpires)) {
      throw new HttpException(
        {
          status: false,
          message: 'Verification code has expired',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (user.verificationCode !== code) {
      throw new HttpException(
        {
          status: false,
          message: 'Invalid verification code',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    user.status = {
      id: StatusEnum.ACTIVE,
    };

    // For CRM agents, set waitingApprovalAt after email verification
    if (user.role?.id === RoleEnum.AGENT) {
      user.waitingApprovalAt = new Date();
    }

    await this.usersService.update(user.id, user);

    return {
      status: true,
      message: user.role?.id === RoleEnum.AGENT
        ? 'Your account has been activated. Please wait for admin approval to access all features.'
        : 'Your account has been activated',
    };
  }

  async forgotPassword(
    email: string,
    roleId: string | undefined,
    isResend: boolean | undefined,
  ): Promise<void> {
    const user = await this.usersService.findOne({
      email,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Email not exist',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    await this.usersService.update(user.id, {
      verificationCode,
      verificationExpires: new Date(Date.now() + 3600000), // 1 hour expiry
    });

    if (isResend) {
      // if (roleId === RoleEnum.PARTNER) {
      //   await this.mailService.partnerSignUp({
      //     to: email,
      //     data: {
      //       verificationCode,
      //       userName: user.firstName + ' ' + user.lastName,
      //     },
      //   });
      // } else {
      await this.mailService.userSignUp({
        to: email,
        data: {
          verificationCode,
          userName: user.firstName + ' ' + user.lastName,
        },
      });
      // }
    } else {
      await this.mailService.forgotPassword({
        to: email,
        data: {
          userFirstName: user.firstName + ' ' + user.lastName,
          verificationCode,
        },
      });
    }
  }

  async verifyPasswordResetCode(email: string, code: string): Promise<void> {
    const user = await this.usersService.findOne({ email });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'User not found',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (!user.verificationCode || !user.verificationExpires) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'Verification code not found or expired',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (new Date() > new Date(user.verificationExpires)) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'Verification code has expired',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (user.verificationCode !== code) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'Invalid verification code',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async resetPassword(email: string, password: string, code: string): Promise<void> {
    const user = await this.usersService.findOne({ email });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'User not found',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (!user.verificationCode || !user.verificationExpires) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'Verification code not found or expired',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (new Date() > new Date(user.verificationExpires)) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'Verification code has expired',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (user.verificationCode !== code) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'Invalid verification code',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    user.password = password;
    user.verificationCode = null;
    user.verificationExpires = null;

    await this.sessionService.softDelete({
      user: {
        id: user.id,
      },
    });

    await this.usersService.update(user.id, user);
  }

  async me(userJwtPayload: JwtPayloadType): Promise<NullableType<any>> {
    if (userJwtPayload.role?.id === RoleEnum.ACCOUNT_MANAGER) {
      const user = await this.usersService.findOne({
        accountManager: { user: { id: userJwtPayload.id } } as AccountManager,
      });
      if (user) return user;
    }
    const user = await this.usersService.findOne({
      id: userJwtPayload.id,
    });
    if (user) {
      const isZohoCodeExist = user?.metaData ? true : false;
      return {
        ...user,
        isZohoCodeExist,
      };
    }
    return null;
  }

  async inviteAccountManager(dto: AccountManagerDto) {
    const password = await generatePassword(8);
    const body = {
      email: dto.email,
      password: password,
      confirm_password: password,
      firstName: dto.firstName,
      lastName: dto.lastName,
    };
    const user = await this.register(body, RoleEnum.ACCOUNT_MANAGER);
    const accountManager =
      await this.accountManagerService.createAccountManager(dto, user.id);

    await this.usersService.update(user.id, {
      accountManagerStatus: AccountManagerStatusEnum.INVITED,
    });

    const url = new URL(
      this.configService.getOrThrow('app.frontendAdminDomain', {
        infer: true,
      }) + '/confirm-account-manager',
    );

    url.searchParams.set('hash', accountManager.id);

    await this.mailService.userTempSignUp({
      to: dto.email,
      data: {
        hash: accountManager.id,
        userName: user.firstName + ' ' + user.lastName,
        url: url.toString(),
      },
    });
  }

  async update(
    userJwtPayload: JwtPayloadType,
    userDto: AuthUpdateDto,
  ): Promise<NullableType<User>> {
    if (userDto.password) {
      if (!userDto.oldPassword) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'Missing old password',
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      const currentUser = await fetchEntity(this.usersService, 'User', {
        id: userJwtPayload.id,
      });
      if (!currentUser.password) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'Incorrect old password',
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      const isValidOldPassword = await bcrypt.compare(
        userDto.oldPassword,
        currentUser.password,
      );

      if (!isValidOldPassword) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'Incorrect old password',
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      } else {
        if (userDto.isSessionDelete) {
          await this.sessionService.softDelete({
            user: {
              id: userJwtPayload.id,
            },
            excludeId: userJwtPayload.sessionId,
          });
        }
      }
    }
    await this.usersService.update(userJwtPayload.id, userDto);
    return this.usersService.findOne({
      id: userJwtPayload.id,
    });
  }

  async refreshToken(
    data: Pick<JwtRefreshPayloadType, 'sessionId'>,
  ): Promise<Omit<LoginResponseType, 'user'>> {
    const session = await this.sessionService.findOne({
      id: data.sessionId,
    });

    if (!session) {
      throw new UnauthorizedException();
    }

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: session.user.id,
      role: session.user.role,
      sessionId: session.id,
    });

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }

  async softDelete(user: User): Promise<void> {
    await this.usersService.softDelete(user.id);
  }

  async logout(data: Pick<JwtRefreshPayloadType, 'sessionId'>) {
    return this.sessionService.softDelete({
      id: data.sessionId,
    });
  }

  private async getTokensData(data: {
    id: User['id'];
    role: User['role'];
    sessionId: Session['id'];
  }) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });

    const tokenExpires =
      Date.now() + ms(tokenExpiresIn as unknown as StringValue);

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }
}
