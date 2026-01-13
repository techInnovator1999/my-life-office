import { ApiProperty } from '@nestjs/swagger';
import { User } from './user';

export class UserPreference {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: User })
  user: User;

  @ApiProperty({ type: Boolean })
  isPushNotificationEnabled: boolean;

  @ApiProperty({ type: Date })
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
