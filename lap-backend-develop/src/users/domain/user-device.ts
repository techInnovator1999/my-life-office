import { ApiProperty } from '@nestjs/swagger';
import { User } from './user';
import { UserDeviceLanguageEnum } from '../users.enum';

export class UserDevice {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  fcmToken: string;

  @ApiProperty({ type: User })
  user: User;

  @ApiProperty({ type: String })
  deviceId: string;

  @ApiProperty({ enum: UserDeviceLanguageEnum })
  language: UserDeviceLanguageEnum;

  @ApiProperty({ type: Date })
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
