import { PushNotificationType } from '@/notification/push.notification.enum';
import { User } from '@/users/domain/user';

export class GetAccountNotificationDto {
  id: string;
  isRead: boolean;
  titleKey: string;
  bodyKey: string;
  entityId?: string | null;
  type: PushNotificationType;
  data: string;
  placeHolderData: string;
  user: User;
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}
