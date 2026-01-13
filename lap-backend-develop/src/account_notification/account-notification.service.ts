import { Injectable } from '@nestjs/common';
import { EntityCondition } from '@/utils/types/entity-condition.type';
import { NullableType } from '../utils/types/nullable.type';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { AccountNotificationRepository } from './persistence/account-notification.repository';
import { CreateAccountNotificationDto } from './dto/create-account-notification.dto';
import { AccountNotification } from './domain/account-notification';
import { UserEntity } from '@/users/infrastructure/persistence/relational/entities/user.entity';
import { SortAccountNotificationDto } from './dto/query-account-notification.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { JwtPayloadType } from '@/auth/strategies/types/jwt-payload.type';
import { GetAccountNotificationDto } from './dto/get-account-notification.dto';
import { UserDeviceLanguageEnum } from '@/users/users.enum';
import { NotificationContentType } from '@/notification/push.notification.enum';
import { PushNotificationService } from '@/notification/push.notification.service';

@Injectable()
export class AccountNotificationService {
  constructor(
    private readonly accountNotificationRepository: AccountNotificationRepository,
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  async create(
    createAccountNotificationDto: CreateAccountNotificationDto,
  ): Promise<boolean> {
    const clonedPayload = {
      isRead: createAccountNotificationDto.isRead,
      titleKey: createAccountNotificationDto.titleKey,
      bodyKey: createAccountNotificationDto.bodyKey,
      type: createAccountNotificationDto.type,
      data: createAccountNotificationDto.data,
      entityId: createAccountNotificationDto.entityId,
      placeHolderData: createAccountNotificationDto.placeHolderData,
      user: { id: createAccountNotificationDto.user } as UserEntity,
    };

    await this.accountNotificationRepository.create(clonedPayload);

    return true;
  }

  async findManyWithPagination({
    sortOptions,
    paginationOptions,
    userJwtPayload,
  }: {
    sortOptions?: SortAccountNotificationDto[] | null;
    paginationOptions: IPaginationOptions;
    userJwtPayload: JwtPayloadType;
  }): Promise<{ total: number; data: GetAccountNotificationDto[] }> {
    const accountNotification =
      await this.accountNotificationRepository.findManyWithPagination({
        sortOptions,
        paginationOptions,
        userJwtPayload,
      });

    for (let i = 0; i < accountNotification.data.length; i++) {
      try {
        accountNotification.data[i].data = JSON.parse(
          accountNotification.data[i].data,
        );
        const placeHolderData = JSON.parse(
          accountNotification.data[i].placeHolderData,
        );
        accountNotification.data[i].body =
          this.pushNotificationService.ReplacePlaceHoldersWithValues(
            accountNotification.data[i].bodyKey,
            placeHolderData,
            UserDeviceLanguageEnum.en,
            NotificationContentType.Body,
          );
      } catch (error) {
        console.log(error);
      }
    }
    return accountNotification;
  }

  async update(
    id: AccountNotification['id'],
    payload: DeepPartial<AccountNotification>,
  ): Promise<AccountNotification | null> {
    const clonedPayload = { ...payload };
    return this.accountNotificationRepository.update(id, clonedPayload);
  }

  async findOne(
    fields: EntityCondition<AccountNotification>,
  ): Promise<NullableType<AccountNotification>> {
    return await this.accountNotificationRepository.findOne(fields);
  }
}
