import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@/users/domain/user';
import { DeepPartial } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/users/users.service';
import { JwtPayloadType } from '@/auth/strategies/types/jwt-payload.type';
import { MailService } from '@/mail/mail.service';
import { AllConfigType } from '@/config/config.type';
import { NullableType } from '@/utils/types/nullable.type';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { EntityCondition } from '@/utils/types/entity-condition.type';
import { AccountManagerRepository } from './persistence/account-manager.repository';
import { AccountManager } from './domain/account-manager';
import { SortAccountManagerDto } from './dto/query-account-manager.dto';
import { FindAllAccountManagerDto } from './dto/find-all-account-managers.dto';
import { AccountManagerDto } from './dto/create-account-manager.dto';
import { RoleEnum } from '@/roles/roles.enum';
import { isEmpty } from 'lodash';
import { AccountManagerPasswordConfigDto } from './dto/account-manager-update.dto';
import { AccountInfoUpdateDto } from './dto/account-info-update.dto';
import { StatusEnum } from '@/statuses/statuses.enum';
import { AccountManagerStatusEnum } from '@/users/users.enum';
import { UserRepository } from '@/users/infrastructure/persistence/user.repository';
import { toFormattedDateString } from '@/utils/util.helper';
// import { toFormattedDateString } from '@/utils/util.helper';

@Injectable()
export class AccountManagerService {
  constructor(
    private readonly accountManagerRepository: AccountManagerRepository,
    private readonly usersRepository: UserRepository,
    private readonly usersService: UsersService,
    private mailService: MailService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  async findOne(
    fields: EntityCondition<AccountManager>,
  ): Promise<NullableType<AccountManager>> {
    return this.accountManagerRepository.findOne(fields);
  }

  async createAccountManager(
    accountManagerDto: AccountManagerDto,
    userId: string,
  ): Promise<AccountManager> {
    const accountManager = {
      access_config: accountManagerDto.access_config,
      user: { id: userId } as User,
    };
    await this.usersService.update(userId, {
      status: { id: StatusEnum.REQUIRED_PASSWORD_CONFIG },
    });
    return this.accountManagerRepository.create(accountManager);
  }

  findManyWithPagination({
    status,
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    status?: string;
    filterOptions?: Record<string, string> | null;
    sortOptions?: SortAccountManagerDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<{ total: number; data: FindAllAccountManagerDto[] }> {
    return this.accountManagerRepository.findManyWithPagination({
      status,
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  async ViewAccountManager(
    userJwtPayload: JwtPayloadType,
    accountManagerId?: string,
  ): Promise<NullableType<any>> {
    let user;
    if (!accountManagerId) {
      user = await this.accountManagerRepository.findOne({
        id: userJwtPayload.id,
      });
    } else {
      user = await this.accountManagerRepository.findOne({
        id: accountManagerId,
      });
    }
    return user;
  }

  async update(
    id: AccountManager['id'],
    payload: DeepPartial<AccountManager>,
  ): Promise<AccountManager | null> {
    const updatedPlan = await this.accountManagerRepository.update(id, payload);
    return updatedPlan;
  }

  async updatePasswordConfig(
    createAccountManager: AccountManagerPasswordConfigDto,
    accountManagerId: string,
  ): Promise<any> {
    const accountManagerObj = await this.accountManagerRepository.findOne({
      id: accountManagerId,
    });
    if (
      !accountManagerObj ||
      accountManagerObj.user.accountManagerStatus !=
        AccountManagerStatusEnum.INVITED ||
      accountManagerObj.user?.role?.id != RoleEnum.ACCOUNT_MANAGER
    ) {
      throw new BadRequestException('Invalid Request');
    }
    await this.usersService.update(accountManagerObj.user.id, {
      password: createAccountManager.password,
      status: { id: StatusEnum.ACTIVE },
    });
    await this.usersService.update(accountManagerObj.user.id, {
      accountManagerStatus: AccountManagerStatusEnum.ACTIVE,
    });
    return true;
  }

  async updateAccountManager(
    accountManagerUpdate: AccountInfoUpdateDto,
    accountManagerId: string,
  ): Promise<any> {
    const accountManagerObj = await this.accountManagerRepository.findOne({
      id: accountManagerId,
    });

    if (
      accountManagerUpdate.accountManager &&
      !isEmpty(accountManagerUpdate.accountManager)
    ) {
      await this.accountManagerRepository.update(
        accountManagerId,
        accountManagerUpdate.accountManager,
      );
    }

    if (
      accountManagerObj &&
      accountManagerUpdate.user &&
      !isEmpty(accountManagerUpdate.user)
    ) {
      const userObj = await this.usersService.findOne({
        accountManager: { id: accountManagerObj.id } as AccountManager,
      });
      if (userObj) {
        accountManagerUpdate.user.role = { id: RoleEnum.ACCOUNT_MANAGER };
        await this.usersService.update(userObj.id, accountManagerUpdate.user);
      }
    }
  }

  async softDelete(id: User['id']): Promise<void> {
    await this.usersRepository.softDelete(id);
  }

  async deactivateAccountManager(id: User['id']): Promise<void> {
    const accountManager = await this.usersRepository.findOne({ id });
    if (!accountManager) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.deactivateAccountManager(id);
    await this.mailService.userDeactivatedEmail({
      to: accountManager.email as string,
      cc: this.configService.getOrThrow('mail.supportAddress', { infer: true }),
      data: {
        userName: accountManager.firstName + ' ' + accountManager.lastName,
        date: toFormattedDateString(new Date()),
        reason: null,
      },
    });
  }

  async abandonedAccountManager(id: User['id']): Promise<void> {
    const accountManager = await this.usersRepository.findOne({ id });
    if (!accountManager) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.abandonedAccountManager(id);

    // await this.mailService.userAccountAbandonedEmail({
    //   to: user.email as string,
    //   cc: this.configService.getOrThrow('mail.supportAddress', {
    //     infer: true,
    //   }),
    //   data: {
    //     userName: user.firstName + ' ' + user.lastName,
    //   },
    // });
  }

  async activateAccountManager(id: User['id']): Promise<void> {
    const accountManager = await this.usersRepository.findOne({ id });
    if (!accountManager) {
      throw new NotFoundException('Account manager not found');
    }
    await this.usersRepository.activateAccountManager(id);
    await this.mailService.userActivatedEmail({
      to: accountManager.email as string,
      cc: this.configService.getOrThrow('mail.supportAddress', { infer: true }),
      data: {
        userName: accountManager.firstName + ' ' + accountManager.lastName,
        date: toFormattedDateString(new Date()),
      },
    });
  }
}
