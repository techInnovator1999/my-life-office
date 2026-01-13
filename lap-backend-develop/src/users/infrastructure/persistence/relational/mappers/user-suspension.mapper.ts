import { UserSuspension } from '@/users/domain/user-suspension';
import { UserSuspensionEntity } from '../entities/user-suspension.entity';
import { UserMapper } from './user.mapper';
import { UserEntity } from '../entities/user.entity';

export class UserSuspensionMapper {
  static toDomain(raw: UserSuspensionEntity): UserSuspension {
    const userSuspension = new UserSuspension();
    userSuspension.id = raw.id;
    userSuspension.startDate = raw.startDate;
    userSuspension.endDate = raw.endDate;
    userSuspension.reason = raw.reason;
    userSuspension.createdAt = raw.createdAt;
    userSuspension.updatedAt = raw.updatedAt;
    userSuspension.deletedAt = raw.deletedAt;
    if (raw.user) {
      userSuspension.user = UserMapper.toDomain(raw.user);
    }
    return userSuspension;
  }

  static toPersistence(userSuspension: UserSuspension): UserSuspensionEntity {
    const userSuspensionEntity = new UserSuspensionEntity();
    userSuspensionEntity.id = userSuspension.id;
    userSuspensionEntity.startDate = userSuspension.startDate;
    userSuspensionEntity.endDate = userSuspension.endDate;
    userSuspensionEntity.reason = userSuspension.reason;
    if (userSuspension.user) {
      userSuspensionEntity.user = userSuspension.user as UserEntity;
    }
    return userSuspensionEntity;
  }
}
