import { User } from '@/users/domain/user';
import { PushNotificationType } from './push.notification.enum';

export class PlaceHolderData {
  key: string;
  value: string;
  isEnum: boolean;
}

export class NotificationData {
  key: string;
  value: string;
}

export class UserNotificationModel {
  type: PushNotificationType;
  placeHolderData: PlaceHolderData[] = [];
  titleKey: string;
  bodyKey: string;
  entityId: string | null;
  user: User;
  title: string;
  body: string;
  data: NotificationData[];
}

export class ChatNotificationModel {
  senderId: string;
  recieverId: string;
  chatId: number;
  content: string;
  imageUrls: string[];
  notificationType: PushNotificationType;
}
