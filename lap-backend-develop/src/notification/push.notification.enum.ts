export enum PushNotificationType {
  NewUserRegistered = 101,
  NewCheckout = 102,
  NewQuestionnaireCompleted = 103,
  NewSupportCreated = 104,
}

export enum PushNotificationPlaceHolders {
  SenderName = 0,
  ReceiverName = 1,
  FromUserName = 4,
  ToUserName = 5,
  Content = 6,
  DocumentName = 7,
  Msg = 8,
  Duration = 9,
}

export enum ChatNotificationType {
  Image = 1,
  Text = 2,
  Document = 3,
  IncomingCall = 11,
  MissedCall = 12,
}

export enum NotificationContentType {
  Title = 1,
  Body = 2,
}
