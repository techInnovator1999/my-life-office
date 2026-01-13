import { UserDeviceLanguageEnum } from '../users.enum';

export class GetUserDeviceDto {
  id: string;
  deviceId: string;
  fcmToken: string;
  language: UserDeviceLanguageEnum;
  user: string;
  createdAt: Date;
}
