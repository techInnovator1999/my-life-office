import { PushNotificationType } from '@/notification/push.notification.enum';
import { User } from '@/users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class AccountNotification {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Boolean })
  isRead: boolean;

  @ApiProperty({ type: String })
  titleKey: string;

  @ApiProperty({ type: String })
  bodyKey: string;

  @ApiProperty({ type: String })
  entityId?: string | null;

  @ApiProperty({ enum: PushNotificationType })
  type: PushNotificationType;

  @ApiProperty({ type: String })
  data: string;

  @ApiProperty({ type: String })
  placeHolderData: string;

  @ApiProperty({ type: User })
  user: User;

  @ApiProperty({ type: Date })
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
