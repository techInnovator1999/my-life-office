import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  Post,
  UseGuards,
  Patch,
  Delete,
  SerializeOptions,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { AuthConfirmEmailDto } from './dto/auth-confirm-email.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { AuthCrmRegisterDto } from './dto/auth-crm-register.dto';
import { LoginResponseType } from './types/login-response.type';
import { NullableType } from '../utils/types/nullable.type';
import { User } from 'src/users/domain/user';
import { RoleEnum } from '@/roles/roles.enum';
import { Roles } from '@/roles/roles.decorator';
import { AuthTokenDto } from './dto/auth-token.dto';
import { RedirectToUser } from './dto/redirectToUser.dto';
import { RolesGuard } from '@/roles/roles.guard';
import { AccountManagerDto } from '@/account-manager/dto/create-account-manager.dto';
import { AccountManagerService } from '@/account-manager/account-manager.service';
import { UsersGuard } from '@/users/users.guard';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private accountManagerService: AccountManagerService,
  ) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('client/login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: LoginResponseType })
  public clientLogin(
    @Body() loginDto: AuthEmailLoginDto,
  ): Promise<LoginResponseType> {
    return this.service.validateLogin(loginDto, false, [RoleEnum.CLIENT]);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: LoginResponseType })
  public adminLogin(
    @Body() loginDto: AuthEmailLoginDto,
  ): Promise<LoginResponseType> {
    return this.service.validateLogin(loginDto, false, [
      RoleEnum.ADMIN,
      RoleEnum.ACCOUNT_MANAGER,
    ]);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('crm/login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: LoginResponseType })
  public crmLogin(
    @Body() loginDto: AuthEmailLoginDto,
  ): Promise<LoginResponseType> {
    return this.service.validateLogin(loginDto, false, [RoleEnum.AGENT]);
  }

  // @SerializeOptions({
  //   groups: ['me'],
  // })
  // @Post('partner/login')
  // @HttpCode(HttpStatus.OK)
  // @ApiResponse({ type: LoginResponseType })
  // public partnerLogin(
  //   @Body() loginDto: AuthEmailLoginDto,
  // ): Promise<LoginResponseType> {
  //   return this.service.validateLogin(loginDto, false, [RoleEnum.PARTNER]);
  // }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Created' })
  async register(@Body() createUserDto: AuthRegisterLoginDto): Promise<User> {
    return this.service.register(createUserDto, RoleEnum.CLIENT);
  }

  @Post('crm/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Created' })
  async crmRegister(@Body() createUserDto: AuthCrmRegisterDto): Promise<User> {
    return this.service.crmRegister(createUserDto);
  }

  // @Post('partner/register')
  // @HttpCode(HttpStatus.CREATED)
  // @ApiResponse({ status: HttpStatus.CREATED, description: 'Created' })
  // async registerPartner(
  //   @Body() createPartnerDtp: AuthPartnerRegisterDto,
  // ): Promise<void> {
  //   await this.service.registerPartner(createPartnerDtp);
  // }

  @Post('/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK })
  async confirmEmail(
    @Body() confirmEmailDto: AuthConfirmEmailDto,
  ): Promise<void> {
    return this.service.confirmEmail(
      confirmEmailDto.code,
      confirmEmailDto.email,
    );
  }

  @Post('forgot/password')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK })
  async forgotPassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<void> {
    return this.service.forgotPassword(
      forgotPasswordDto.email,
      RoleEnum.CLIENT,
      forgotPasswordDto.isResend,
    );
  }

  @Post('crm/forgot/password')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK })
  async crmForgotPassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<void> {
    return this.service.forgotPassword(
      forgotPasswordDto.email,
      RoleEnum.AGENT,
      forgotPasswordDto.isResend,
    );
  }

  @Post('invite')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @HttpCode(HttpStatus.CREATED)
  @Roles([
    RoleEnum.ADMIN,
    //  RoleEnum.PARTNER,
    RoleEnum.ACCOUNT_MANAGER,
  ])
  async InviteAccountManager(
    @Body() createAccountManagerDto: AccountManagerDto,
  ) {
    return await this.service.inviteAccountManager(createAccountManagerDto);
  }

  @Post('verify/password-reset-code')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK })
  verifyPasswordResetCode(
    @Body() verifyCodeDto: { email: string; code: string },
  ): Promise<void> {
    return this.service.verifyPasswordResetCode(
      verifyCodeDto.email,
      verifyCodeDto.code,
    );
  }

  @Post('reset/password')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: HttpStatus.CREATED })
  resetPassword(@Body() resetPasswordDto: AuthResetPasswordDto): Promise<void> {
    return this.service.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.password,
      resetPasswordDto.code,
    );
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Get('me')
  @UseGuards(AuthGuard('jwt'), UsersGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: User })
  public me(@Request() request): Promise<NullableType<any>> {
    return this.service.me(request.user);
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: LoginResponseType })
  public refresh(@Request() request): Promise<Omit<LoginResponseType, 'user'>> {
    return this.service.refreshToken({
      sessionId: request.user.sessionId,
    });
  }

  @ApiBearerAuth()
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK })
  public async logout(@Request() request): Promise<void> {
    await this.service.logout({
      sessionId: request.user.sessionId,
    });
  }

  @Get('redirectToUser/:id')
  @HttpCode(HttpStatus.OK)
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @ApiResponse({ type: String })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  generateTokenByUserId(@Param('id') id: User['id']): Promise<RedirectToUser> {
    return this.service.generateTokenByUserId(id);
  }

  @Post('loginWithToken')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: HttpStatus.CREATED })
  loginWithToken(@Body() authToken: AuthTokenDto): Promise<void> {
    return this.service.loginWithToken(authToken.token);
  }
  // @ApiBearerAuth()
  // @Post('session/delete')
  // @UseGuards(AuthGuard('jwt'))
  // @HttpCode(HttpStatus.CREATED)
  // @Roles([RoleEnum.ADMIN, RoleEnum.CLIENT, RoleEnum.PARTNER, RoleEnum.ACCOUNT_MANAGER, RoleEnum.DEMOCLIENT])
  // @ApiResponse({ status: HttpStatus.CREATED })
  // SessionDelete(@Request() request): Promise<boolean> {
  //   return this.service.sessionDelete(request.user);
  // }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Patch('me')
  @UseGuards(AuthGuard('jwt'), UsersGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: User })
  public update(
    @Request() request,
    @Body() userDto: AuthUpdateDto,
  ): Promise<NullableType<User>> {
    return this.service.update(request.user, userDto);
  }

  @ApiBearerAuth()
  @Delete('me')
  @UseGuards(AuthGuard('jwt'), UsersGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK })
  public async delete(@Request() request): Promise<void> {
    return this.service.softDelete(request.user);
  }
}
