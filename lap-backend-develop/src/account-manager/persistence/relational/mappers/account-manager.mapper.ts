import { UserEntity } from '@/users/infrastructure/persistence/relational/entities/user.entity';
import { UserMapper } from '@/users/infrastructure/persistence/relational/mappers/user.mapper';
import { AccountManagerEntity } from '../entities/account-manager.entity';
import { AccountManager } from '@/account-manager/domain/account-manager';
import { FindAllAccountManagerDto } from '@/account-manager/dto/find-all-account-managers.dto';

export class AccountManagerMapper {
  static toPersistence(accountManager: AccountManager): AccountManagerEntity {
    const accountManagerEntity = new AccountManagerEntity();
    accountManagerEntity.id = accountManager.id;
    accountManagerEntity.access_config = accountManager.access_config;
    accountManagerEntity.createdAt = accountManager.createdAt;
    accountManagerEntity.updatedAt = accountManager.updatedAt;
    accountManagerEntity.deletedAt = accountManager.deletedAt;
    if (accountManager.user) {
      accountManagerEntity.user = { id: accountManager.user.id } as UserEntity;
    }

    return accountManagerEntity;
  }

  static toDomain(accountManagerEntity: AccountManagerEntity): AccountManager {
    const accountManager = new AccountManager();
    accountManager.id = accountManagerEntity.id;
    accountManager.access_config = accountManagerEntity.access_config;
    accountManager.createdAt = accountManagerEntity.createdAt;
    accountManager.updatedAt = accountManagerEntity.updatedAt;
    accountManager.deletedAt = accountManagerEntity.deletedAt;

    if (accountManagerEntity.user)
      accountManager.user = UserMapper.toDomain(accountManagerEntity.user);
    return accountManager;
  }

  static toDomainMany(
    accountManagerEntity: AccountManagerEntity,
  ): FindAllAccountManagerDto {
    const accountManager = new FindAllAccountManagerDto();
    accountManager.id = accountManagerEntity.id;
    accountManager.access_config = accountManagerEntity.access_config;
    accountManager.createdAt = accountManagerEntity.createdAt;
    accountManager.updatedAt = accountManagerEntity.updatedAt;
    accountManager.deletedAt = accountManagerEntity.deletedAt;

    if (accountManagerEntity.user)
      accountManager.user = UserMapper.toDomain(accountManagerEntity.user);
    return accountManager;
  }
}
