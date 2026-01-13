import { UserDeviceEntity } from '../entities/user-device.entity';
import { UserDevice } from '@/users/domain/user-device';
import { User } from '@/users/domain/user';
import { UserEntity } from '../entities/user.entity';
import { GetUserDeviceDto } from '@/users/dto/get-user-device.dto';

export class UserDeviceMapper {
  static toDomain(raw: UserDeviceEntity): UserDevice {
    const userDevice = new UserDevice();
    userDevice.id = raw.id;
    userDevice.deviceId = raw.deviceId;
    userDevice.fcmToken = raw.fcmToken;
    userDevice.language = raw.language;
    if (raw.user) userDevice.user = { id: raw.user.id } as User;
    userDevice.createdAt = raw.createdAt;
    userDevice.updatedAt = raw.updatedAt;
    userDevice.deletedAt = raw.deletedAt;
    return userDevice;
  }

  static toDomainMany(raw: UserDeviceEntity): GetUserDeviceDto {
    const userDevice = new GetUserDeviceDto();
    userDevice.id = raw.id;
    userDevice.createdAt = raw.createdAt;
    userDevice.deviceId = raw.deviceId;
    userDevice.fcmToken = raw.fcmToken;
    userDevice.language = raw.language;
    if (raw.user) {
      userDevice.user = raw.user?.id;
    }

    return userDevice;
  }

  static toPersistence(userDevice: UserDevice): UserDeviceEntity {
    const userDeviceEntity = new UserDeviceEntity();
    userDeviceEntity.id = userDevice.id;
    userDeviceEntity.deviceId = userDevice.deviceId;
    userDeviceEntity.fcmToken = userDevice.fcmToken;
    userDeviceEntity.language = userDevice.language;
    if (userDevice.user) {
      userDeviceEntity.user = {
        id: userDevice.user.id,
      } as UserEntity;
    }

    return userDeviceEntity;
  }
}
