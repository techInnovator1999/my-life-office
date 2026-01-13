import { Module } from '@nestjs/common';
import { PushController } from './push.notification.controller';
import { PushNotificationService } from './push.notification.service';
import { FcmService } from './fcm.service';
import { UsersModule } from '@/users/users.module';
import { RelationalAccountNotificationPersistenceModule } from '@/account_notification/persistence/relational/relational-persistence.module';

@Module({
  imports: [UsersModule, RelationalAccountNotificationPersistenceModule],

  exports: [PushNotificationService, FcmService],
  controllers: [PushController],
  providers: [PushNotificationService, FcmService],
})
export class PushNotificationModule {}
