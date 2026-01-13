import { Module } from '@nestjs/common';
import { UsersModule } from '@/users/users.module';
import { RelationalAccountNotificationPersistenceModule } from './persistence/relational/relational-persistence.module';
import { AccountNotificationController } from './account-notification.controller';
import { AccountNotificationService } from './account-notification.service';
import { PushNotificationModule } from '@/notification/push.notification.module';

@Module({
  imports: [
    RelationalAccountNotificationPersistenceModule,
    UsersModule,
    PushNotificationModule,
    UsersModule,
  ],
  controllers: [AccountNotificationController],
  providers: [AccountNotificationService],
  exports: [
    AccountNotificationService,
    RelationalAccountNotificationPersistenceModule,
  ],
})
export class AccountNotificationModule {}
