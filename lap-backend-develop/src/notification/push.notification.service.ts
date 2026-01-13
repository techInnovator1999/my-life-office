import { Injectable } from '@nestjs/common';

import {
  NotificationData,
  PlaceHolderData,
  UserNotificationModel,
} from './push.notification.model';
import en from './notification_content/en.json';
import { User } from '@/users/domain/user';
import { UserDeviceRepository } from '@/users/infrastructure/persistence/user-device.repository';
import { AccountNotificationRepository } from '@/account_notification/persistence/account-notification.repository';
import {
  NotificationContentType,
  PushNotificationPlaceHolders,
  PushNotificationType,
} from './push.notification.enum';
import { AccountNotification } from '@/account_notification/domain/account-notification';
import { UserDeviceLanguageEnum } from '@/users/users.enum';
import { IsEmptyOrSpaces } from '@/utils/util.helper';
import { FcmService } from './fcm.service';
import { UsersService } from '@/users/users.service';
import { RoleEnum } from '@/roles/roles.enum';
import { In } from 'typeorm';

@Injectable()
export class PushNotificationService {
  constructor(
    private _userService: UsersService,
    private _userDeviceRepository: UserDeviceRepository,
    private _accountNotificationRepository: AccountNotificationRepository,
    private fcmService: FcmService,
  ) {}

  private async GetUserAndDataToReplace(
    type: PushNotificationType,
    entityId: string | null,
    currentUser: User,
  ): Promise<UserNotificationModel[]> {
    const response: UserNotificationModel[] = [];
    const userNotification = new UserNotificationModel();
    userNotification.placeHolderData = [];
    userNotification.entityId = entityId;
    const senderBodyKey: string = `sb${type}`;
    const senderTitleKey: string = `st${type}`;
    const adminTitleKey: string = `at${type}`;
    const adminBodyKey: string = `ab${type}`;
    userNotification.type = type;
    const senderUser: User = currentUser;
    const Data: NotificationData[] = [];
    Data.push({ key: 'notificationType', value: type.toString() });
    const fullName = senderUser.firstName + ' ' + senderUser.lastName;

    switch (type) {
      case PushNotificationType.NewUserRegistered:
      case PushNotificationType.NewQuestionnaireCompleted:
      case PushNotificationType.NewSupportCreated:
      case PushNotificationType.NewCheckout:
        Data.push(
          {
            key: 'user',
            value: senderUser.id ?? '',
          },
          {
            key: 'dateTime',
            value: new Date().toDateString(),
          },
          {
            key: 'userName',
            value: senderUser.firstName + ' ' + senderUser.lastName,
          },
        );
        break;
    }

    const adminsAndAccountManagers = await this._userService.findManyUser({
      role: { id: In([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER]) } as any,
    });

    adminsAndAccountManagers.forEach((admin) => {
      const adminNotification: UserNotificationModel =
        new UserNotificationModel();
      adminNotification.placeHolderData.push(
        this.CreatePlaceHolderData(
          PushNotificationPlaceHolders.FromUserName,
          fullName,
          false,
        ),
      );
      adminNotification.type = type;
      adminNotification.user = admin;
      adminNotification.bodyKey = adminBodyKey;
      adminNotification.titleKey = adminTitleKey;
      adminNotification.data = [...Data];
      response.push(adminNotification);
    });

    userNotification.user = senderUser;
    userNotification.bodyKey = senderBodyKey;
    userNotification.titleKey = senderTitleKey;
    userNotification.data = [...Data];
    response.push(userNotification);

    // is function me issue hy userNotification ko
    //setting up receiver notifications

    const currentUserTypeData = new NotificationData();
    currentUserTypeData.key = 'currentUserType';

    return response;
  }

  private CreatePlaceHolderData(
    Key: PushNotificationPlaceHolders,
    Value: string,
    IsEnum: boolean,
  ) {
    const placeHolderValue = new PlaceHolderData();
    placeHolderValue.key = PushNotificationPlaceHolders[Key];
    placeHolderValue.value = Value;
    placeHolderValue.isEnum = IsEnum;

    return placeHolderValue;
  }
  //toUser?: User
  public async SendPushNotificationAsync(
    type: PushNotificationType,
    entityId: string | null,
    currentUser: User,
  ): Promise<boolean> {
    const data = await this.GetUserAndDataToReplace(
      type,
      entityId,
      currentUser,
    );

    for (let i = 0; i < data.length; i++) {
      await this.SendPersistNotification(data[i]);
    }

    return true;
  }

  public ReplacePlaceHoldersWithValues(
    contentKey: string,
    placeHolderValues: PlaceHolderData[],
    language: UserDeviceLanguageEnum,
    type: NotificationContentType,
  ): string {
    let response = '';
    let translations: any;
    switch (language) {
      case UserDeviceLanguageEnum.en:
        translations = en;
    }

    response = translations.filter(
      (translation) => translation.Key == contentKey,
    )[0]?.Translation;
    if (!response) {
      return '';
    }
    for (const placeHolderValue of placeHolderValues) {
      const toReplace = `{${placeHolderValue.key}}`;
      if (placeHolderValue.isEnum) {
        const enumDescriptionTranslation = translations.filter(
          (translation) => translation.Key == placeHolderValue.value,
        )[0].Translation;
        response = response.replace(toReplace, enumDescriptionTranslation);
      } else {
        response = response.replace(toReplace, placeHolderValue.value);
      }
    }

    // type == NotificationContentType.Title
    //   ? (response = `${response}`)
    //   : response;

    console.log(type);

    return response;
  }

  async SendPersistNotification(
    request: UserNotificationModel,
  ): Promise<boolean> {
    const userIdData = new NotificationData();
    userIdData.key = 'currentUserId';
    userIdData.value = request.user.id;
    request.data.push(userIdData);

    let userDevices = await this._userDeviceRepository.findMany({
      user: { id: request.user.id } as User,
    });
    userDevices = userDevices.filter(
      (userDevice) => !IsEmptyOrSpaces(userDevice.fcmToken),
    );
    // let Data = {};
    // request.data.forEach((key) => {
    //   Data[`${key.key}`] = key.value;
    // });

    const isToSendNotification = en.filter(
      (translation) => translation.Key == request.bodyKey,
    )[0]
      ? true
      : false;

    if (isToSendNotification) {
      for (const userDevice of userDevices) {
        const languagePreference = userDevice.language;
        request.body = await this.ReplacePlaceHoldersWithValues(
          request.bodyKey,
          request.placeHolderData,
          languagePreference,
          NotificationContentType.Body,
        );
        request.title = 'Life Agent Portal';

        if (!request.body) {
          return false;
        }

        const data = {};
        request.data.forEach((key) => {
          data[key.key] = key.value;
        });
        try {
          await this.fcmService.SendNotification(
            userDevice.fcmToken,
            request.title,
            request.body,
            data,
          );
        } catch (error) {
          console.log(error);
        }
      }

      const accountNotification: AccountNotification =
        new AccountNotification();
      accountNotification.bodyKey = request.bodyKey;
      accountNotification.titleKey = request.titleKey;
      accountNotification.data = JSON.stringify(request.data);
      accountNotification.isRead = false;
      accountNotification.user = { id: request.user.id } as User;
      accountNotification.entityId = request.entityId;
      accountNotification.type = request.type;
      accountNotification.placeHolderData = JSON.stringify(
        request.placeHolderData,
      );
      await this._accountNotificationRepository.create(accountNotification);
    }

    return true;
  }
}
