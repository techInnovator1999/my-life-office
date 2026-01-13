import { PushNotificationService } from './push.notification.service';

import {
  Controller,
  Get,
  HttpStatus,
  HttpCode,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '@/roles/roles.decorator';
import { RoleEnum } from '@/roles/roles.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChatNotificationModel } from './push.notification.model';
import { PushNotificationType } from './push.notification.enum';
import { RolesGuard } from '@/roles/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { UsersGuard } from '@/users/users.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
@ApiTags('Push Notification')
@Controller({
  path: 'push-notification',
  version: '1',
})
export class PushController {
  constructor(private pushNotificationService: PushNotificationService) {}

  @Get()
  @Roles([RoleEnum.ADMIN, RoleEnum.CLIENT, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  async TestNotification(@Request() request): Promise<any> {
    const notificationPayload = new ChatNotificationModel();
    notificationPayload.chatId = 1;
    notificationPayload.content = 'Test Content';
    notificationPayload.notificationType = PushNotificationType.NewCheckout;

    notificationPayload.imageUrls = [
      'https://i.pinimg.com/1200x/9b/af/24/9baf24c6c083948e732ee648c380dedc.jpg',
    ];
    notificationPayload.recieverId = request.user.id;
    notificationPayload.senderId = request.user.id;
    return this.pushNotificationService.SendPushNotificationAsync(
      PushNotificationType.NewCheckout,
      null,
      request.user,
    );
  }
}
