import { User } from '@/users/domain/user';
import { UserEntity } from '../entities/user.entity';
import { UserPreferenceEntity } from '../entities/user-preference.entity';
import { UserPreference } from '@/users/domain/user-preference';

export class UserPreferenceMapper {
  static toDomain(raw: UserPreferenceEntity): UserPreference {
    const userPreference = new UserPreference();
    userPreference.id = raw.id;
    userPreference.isPushNotificationEnabled = raw.isPushNotificationEnabled;
    if (raw.user) userPreference.user = { id: raw.user.id } as User;
    userPreference.createdAt = raw.createdAt;
    userPreference.updatedAt = raw.updatedAt;
    userPreference.deletedAt = raw.deletedAt;
    return userPreference;
  }

  static toPersistence(userPreference: UserPreference): UserPreferenceEntity {
    const userDeviceEntity = new UserPreferenceEntity();
    userDeviceEntity.id = userPreference.id;
    userDeviceEntity.isPushNotificationEnabled =
      userPreference.isPushNotificationEnabled;
    if (userPreference.user) {
      userDeviceEntity.user = {
        id: userPreference.user.id,
      } as UserEntity;
    }

    return userDeviceEntity;
  }
}
