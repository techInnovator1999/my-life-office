import { UserEntity } from '@/users/infrastructure/persistence/relational/entities/user.entity';
import { User } from '@/users/domain/user';
import { AccountNotificationEntity } from '../entities/account-notification.entity';
import { AccountNotification } from '@/account_notification/domain/account-notification';
import { GetAccountNotificationDto } from '@/account_notification/dto/get-account-notification.dto';

export class AccountNotificationMapper {
  static toDomain(raw: AccountNotificationEntity): AccountNotification {
    const accountInformation = new AccountNotification();
    accountInformation.id = raw.id;
    accountInformation.bodyKey = raw.bodyKey;
    accountInformation.type = raw.type;
    accountInformation.titleKey = raw.titleKey;
    accountInformation.entityId = raw.entityId;
    accountInformation.createdAt = raw.createdAt;
    accountInformation.isRead = raw.isRead;
    accountInformation.placeHolderData = raw.placeHolderData;
    accountInformation.data = raw.data;
    accountInformation.updatedAt = raw.updatedAt;
    if (raw.user) accountInformation.user = { id: raw.user.id } as User;

    return accountInformation;
  }

  static toDomainMany(
    raw: AccountNotificationEntity,
  ): GetAccountNotificationDto {
    const accountNotification = new GetAccountNotificationDto();
    accountNotification.id = raw.id;
    accountNotification.bodyKey = raw.bodyKey;
    accountNotification.entityId = raw.entityId;
    accountNotification.data = raw.data;
    accountNotification.isRead = raw.isRead;
    accountNotification.placeHolderData = raw.placeHolderData;
    accountNotification.type = raw.type;
    accountNotification.createdAt = raw.createdAt;
    accountNotification.updatedAt = raw.updatedAt;
    if (raw.user) {
      accountNotification.user = { id: raw.user?.id } as User;
    }

    return accountNotification;
  }

  static toPersistence(
    accountInformation: AccountNotification,
  ): AccountNotificationEntity {
    const accountInformationEntity = new AccountNotificationEntity();
    accountInformationEntity.titleKey = accountInformation.titleKey;
    accountInformationEntity.bodyKey = accountInformation.bodyKey;
    accountInformationEntity.type = accountInformation.type;
    accountInformationEntity.entityId = accountInformation.entityId;
    accountInformationEntity.createdAt = accountInformation.createdAt;
    accountInformationEntity.isRead = accountInformation.isRead;
    accountInformationEntity.data = accountInformation.data;
    accountInformationEntity.updatedAt = accountInformation.updatedAt;
    accountInformationEntity.id = accountInformation.id;
    accountInformationEntity.placeHolderData =
      accountInformation.placeHolderData;
    if (accountInformation.user) {
      accountInformationEntity.user = {
        id: accountInformation.user.id,
      } as UserEntity;
    }

    return accountInformationEntity;
  }
}
