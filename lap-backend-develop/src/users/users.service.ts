import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityCondition } from '@/utils/types/entity-condition.type';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { CreateUserDto } from './dto/create-user.dto';
import { NullableType } from '../utils/types/nullable.type';
import { SortUserDto } from './dto/query-user.dto';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { DeepPartial } from '@/utils/types/deep-partial.type';
import { User } from './domain/user';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { RoleEnum } from '@/roles/roles.enum';
import { FilesService } from '@/files/files.service';
import bcrypt from 'bcryptjs';
import { AuthProvidersEnum } from '@/auth/auth-providers.enum';
import { FindAllUserDto } from './dto/find-all-user.dto';
import { UserDeviceRepository } from './infrastructure/persistence/user-device.repository';
import { UserEntity } from './infrastructure/persistence/relational/entities/user.entity';
import { UserDevice } from './domain/user-device';
import { UserPreferenceRepository } from './infrastructure/persistence/user-preference.repository';
import { CreateUserDeviceDto } from './dto/create-user-device.dto';
import { CreateUserPreferenceDto } from './dto/create-user-preference.dto';
import { UserPreference } from './domain/user-preference';
import { GetUserDeviceDto } from './dto/get-user-device.dto';
import { UserSuspensionRepository } from './infrastructure/persistence/user-suspension.repository';
import { CreateUserSuspensionDto } from './dto/create-user-suspension.dto';
import { GetUserSuspensionDto } from './dto/get-user-suspension.dto';
import { UserSuspension } from './domain/user-suspension';
import { DeactivateUserDto } from './dto/deactivate-user.dto';
import { MailService } from '@/mail/mail.service';
import { toFormattedDateString } from '@/utils/util.helper';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { FindOptionsWhere, In } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly userDeviceRepository: UserDeviceRepository,
    private readonly userPreferenceRepository: UserPreferenceRepository,
    private readonly userSuspensionRepository: UserSuspensionRepository,
    private readonly filesService: FilesService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async createUserDevice(
    createUserDeviceDto: CreateUserDeviceDto,
  ): Promise<boolean> {
    const doesExist = await this.userDeviceRepository.findOne({
      fcmToken: createUserDeviceDto.fcmToken,
    });
    if (doesExist) {
      return true;
    }
    const clonedPayload = {
      fcmToken: createUserDeviceDto.fcmToken,
      deviceId: createUserDeviceDto?.deviceId,
      language: createUserDeviceDto?.language,
      user: { id: createUserDeviceDto.user } as UserEntity,
    };

    await this.userDeviceRepository.create(clonedPayload);

    return true;
  }

  async updateUserDevice(
    id: UserDevice['id'],
    payload: DeepPartial<UserDevice>,
  ): Promise<UserDevice | null> {
    const clonedPayload = { ...payload };
    return this.userDeviceRepository.update(id, clonedPayload);
  }

  async findOneUserDevice(
    fields: EntityCondition<UserDevice>,
  ): Promise<NullableType<UserDevice>> {
    return await this.userDeviceRepository.findOne(fields);
  }

  async findManyUserDevice(
    fields: EntityCondition<UserDevice>,
  ): Promise<NullableType<GetUserDeviceDto[]>> {
    return await this.userDeviceRepository.findMany(fields);
  }

  async findManyUser(fields: EntityCondition<User>): Promise<FindAllUserDto[]> {
    return await this.usersRepository.findMany(fields);
  }

  async createUserPreference(
    createUserPreferenceDto: CreateUserPreferenceDto,
  ): Promise<boolean> {
    const clonedPayload = {
      isPushNotificationEnabled:
        createUserPreferenceDto.isPushNotificationEnabled,
      user: { id: createUserPreferenceDto.user } as UserEntity,
    };

    await this.userPreferenceRepository.create(clonedPayload);

    return true;
  }

  async updateUserPreference(
    id: UserPreference['id'],
    payload: DeepPartial<UserPreference>,
  ): Promise<UserPreference | null> {
    const clonedPayload = { ...payload };
    return this.userPreferenceRepository.update(id, clonedPayload);
  }

  async findOneUserPreference(
    fields: EntityCondition<UserPreference>,
  ): Promise<NullableType<UserPreference>> {
    return await this.userPreferenceRepository.findOne(fields);
  }

  async create(
    createProfileDto: CreateUserDto,
    roleId: string,
    isShowToolTip?: boolean,
  ): Promise<User> {
    const clonedPayload = {
      provider: AuthProvidersEnum.email,
      ...createProfileDto,
      isShowToolTip,
    };

    if (clonedPayload.password) {
      const salt = await bcrypt.genSalt();
      clonedPayload.password = await bcrypt.hash(clonedPayload.password, salt);
    }

    if (clonedPayload.email) {
      const userObject = await this.usersRepository.findOne({
        email: clonedPayload.email,
        role: {
          id: roleId,
        },
      });
      if (userObject) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'Email already exists',
          },
          HttpStatus.CONFLICT,
        );
      }
    }

    if (clonedPayload.photo?.id) {
      const fileObject = await this.filesService.findOne({
        id: clonedPayload.photo.id,
      });
      if (!fileObject) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'Image not exist',
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (clonedPayload.role?.id) {
      const roleObject = Object.values(RoleEnum).includes(
        clonedPayload.role.id,
      );
      if (!roleObject) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'Role not exist',
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (clonedPayload.status?.id) {
      const statusObject = Object.values(StatusEnum).includes(
        clonedPayload.status.id,
      );
      if (!statusObject) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'Status not exist',
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (createProfileDto.verificationCode) {
      clonedPayload.verificationCode = createProfileDto.verificationCode;
    }

    if (createProfileDto.verificationExpires) {
      clonedPayload.verificationExpires = new Date(
        createProfileDto.verificationExpires,
      );
    }

    return this.usersRepository.create(clonedPayload, isShowToolTip);
  }

  findManyWithPagination({
    filterOptions,
    userId,
    role,
    currentUserId,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: Record<string, string> | null;
    userId?: string | null;
    role: string;
    currentUserId: string;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<{ total: number; data: FindAllUserDto[] }> {
    return this.usersRepository.findManyWithPagination({
      filterOptions,
      userId,
      role,
      currentUserId,
      sortOptions,
      paginationOptions,
    });
  }

  async filterRegisteredUsersBySixMonths(): Promise<any> {
    const rawCart =
      await this.usersRepository.filterRegisteredUsersBySixMonths();

    return rawCart;
  }

  findOne(fields: EntityCondition<User>): Promise<NullableType<User>> {
    return this.usersRepository.findOne(fields);
  }

  findOneById(id: User['id']): Promise<NullableType<User>> {
    return this.usersRepository.findOneById(id);
  }

  async countRegUsersMoreThanSixtyDays(): Promise<{ count: number }> {
    return this.usersRepository.countRegUsersMoreThanSixtyDays();
  }

  async countRegUsersLessThanSixtyDays(): Promise<{ count: number }> {
    return this.usersRepository.countRegUsersLessThanSixtyDays();
  }

  async countTotalRegisteredUsers(
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ count: number }> {
    if (startDate && endDate)
      return this.usersRepository.countTotalRegisteredUsers(startDate, endDate);
    return this.usersRepository.countTotalRegisteredUsers();
  }

  async countTotalRegisteredUsersByMonths(
    startDate: Date,
    endDate: Date,
  ): Promise<{ month: string; count: number }[]> {
    return this.usersRepository.countTotalRegisteredUsersByMonths(
      startDate,
      endDate,
    );
  }

  async countAccountManagerStasuses(): Promise<any> {
    const data = await this.usersRepository.countAccountManagerStasuses();
    return data;
  }

  async update(id: User['id'], payload: Partial<User>): Promise<User | null> {
    const clonedPayload = { ...payload };

    if (
      clonedPayload.password &&
      clonedPayload.previousPassword !== clonedPayload.password
    ) {
      const salt = await bcrypt.genSalt();
      clonedPayload.password = await bcrypt.hash(clonedPayload.password, salt);
    }

    if (clonedPayload.email && payload.role) {
      const userObject = await this.usersRepository.findOne({
        email: clonedPayload.email,
        role: { id: payload.role!.id as string },
      });

      if (userObject?.id !== id) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'Email already exists',
          },
          HttpStatus.CONFLICT,
        );
      }
    }

    if (clonedPayload.photo?.id) {
      const fileObject = await this.filesService.findOne({
        id: clonedPayload.photo.id,
      });
      if (!fileObject) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'Image not exists',
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (clonedPayload.role?.id) {
      const roleObject = Object.values(RoleEnum).includes(
        clonedPayload.role.id,
      );
      if (!roleObject) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'Role not exists',
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (clonedPayload.status?.id) {
      const statusObject = Object.values(StatusEnum).includes(
        clonedPayload.status.id,
      );
      if (!statusObject) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'Status not exists',
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    return this.usersRepository.update(id, clonedPayload);
  }

  async softDelete(id: User['id']): Promise<void> {
    await this.usersRepository.softDelete(id);
  }

  async hardDelete(id: User['id']): Promise<void> {
    const user = await this.usersRepository.findOne({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.delete(id);
    await this.mailService.userDeletedEmail({
      to: user.email as string,
      cc: this.configService.getOrThrow('mail.supportAddress', {
        infer: true,
      }),
      data: {
        userName: user.firstName + ' ' + user.lastName,
        date: toFormattedDateString(new Date()),
      },
    });
  }

  async deactivateUser(id: User['id'], dto: DeactivateUserDto): Promise<void> {
    const user = await this.usersRepository.findOne({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.deactivateUser(id, dto.reason);
    await this.mailService.userDeactivatedEmail({
      to: user.email as string,
      cc: this.configService.getOrThrow('mail.supportAddress', { infer: true }),
      data: {
        reason: dto.reason,
        userName: user.firstName + ' ' + user.lastName,
        date: toFormattedDateString(new Date()),
      },
    });
  }

  async abandonedUser(id: User['id']): Promise<void> {
    const user = await this.usersRepository.findOne({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.abandonedUser(id);
    await this.mailService.userAccountAbandonedEmail({
      to: user.email as string,
      cc: this.configService.getOrThrow('mail.supportAddress', {
        infer: true,
      }),
      data: {
        userName: user.firstName + ' ' + user.lastName,
      },
    });
  }

  async activateUser(id: User['id']): Promise<void> {
    const user = await this.usersRepository.findOne({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.activateUser(id);
    await this.mailService.userActivatedEmail({
      to: user.email as string,
      cc: this.configService.getOrThrow('mail.supportAddress', { infer: true }),
      data: {
        userName: user.firstName + ' ' + user.lastName,
        date: toFormattedDateString(new Date()),
      },
    });
  }

  async isUserSuspended(id: User['id']): Promise<boolean> {
    const isSuspended = await this.userSuspensionRepository.isUserSuspended(id);
    return isSuspended;
  }

  async suspendUser(
    id: User['id'],
    dto: CreateUserSuspensionDto,
  ): Promise<void> {
    const user = await this.usersRepository.findOne({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isAlreadySuspended = await this.isUserSuspended(id);
    if (isAlreadySuspended) {
      throw new BadRequestException('User is already suspended');
    }
    await this.userSuspensionRepository.create({
      user: { id } as User,
      ...dto,
    });
    await this.mailService.userSuspendedEmail({
      to: user.email as string,
      cc: this.configService.getOrThrow('mail.supportAddress', { infer: true }),
      data: {
        userName: user.firstName + ' ' + user.lastName,
        startDate: toFormattedDateString(dto.startDate),
        endDate: dto.endDate
          ? toFormattedDateString(dto.endDate)
          : 'Until further notice',
        reason: dto.reason,
      },
    });
  }

  async unSuspend(id: UserSuspension['id']): Promise<void> {
    const userSuspension = await this.userSuspensionRepository.update(id, {
      endDate: new Date(),
    });
    if (!userSuspension) {
      throw new NotFoundException('Suspension not found');
    }
    await this.mailService.userUnsuspendedEmail({
      to: userSuspension.user.email as string,
      cc: this.configService.getOrThrow('mail.supportAddress', { infer: true }),
      data: {
        userName:
          userSuspension.user.firstName + ' ' + userSuspension.user.lastName,
        endDate: toFormattedDateString(new Date()),
        reason: userSuspension.reason,
      },
    });
  }

  async getUserAllSuspensions(id: User['id']): Promise<GetUserSuspensionDto[]> {
    const suspensions = await this.userSuspensionRepository.findMany({
      user: { id } as User,
    });
    return suspensions.map((suspension) => ({
      id: suspension.id,
      userId: suspension.user.id,
      startDate: suspension.startDate,
      endDate: suspension.endDate,
      reason: suspension.reason,
      createdAt: suspension.createdAt,
      updatedAt: suspension.updatedAt,
    }));
  }

  async getUserActiveSuspensions(
    id: User['id'],
  ): Promise<GetUserSuspensionDto[]> {
    const suspensions =
      await this.userSuspensionRepository.findActiveSuspensionsByUserId(id);
    return suspensions.map((suspension) => ({
      id: suspension.id,
      userId: suspension.user.id,
      startDate: suspension.startDate,
      endDate: suspension.endDate,
      reason: suspension.reason,
      createdAt: suspension.createdAt,
      updatedAt: suspension.updatedAt,
    }));
  }

  generateWhereClausesForFilters() {
    // partnerId?: string, // currentUserId: string, // role: string, // filter: FilterValuesEnum | null,
    const where: FindOptionsWhere<UserEntity> = {};

    where.role = { id: In([RoleEnum.CLIENT]) };

    return where;
  }

  async findAllWithConditions(
    where: FindOptionsWhere<UserEntity>,
    page?: number,
    limit?: number,
  ) {
    return await this.usersRepository.findAllWithConditions(where, page, limit);
  }

  async countBlockedUsers(
    role?: string | null,
    user?: string | null,
  ): Promise<any> {
    const data = await this.usersRepository.countBlockedUsers(role, user);
    return data;
  }

  async countTotalRegisteredClients(
    role?: string | null,
    user?: string | null,
  ): Promise<{ count: number }> {
    return this.usersRepository.countTotalRegisteredClients(role, user);
  }

  async countAbandonedClients(
    role?: string | null,
    user?: string | null,
  ): Promise<{ count: number }> {
    return this.usersRepository.countAbandonedClients(role, user);
  }

  async countActiveClients(
    role?: string | null,
    user?: string | null,
  ): Promise<{ count: number }> {
    return this.usersRepository.countActiveClients(role, user);
  }
}
