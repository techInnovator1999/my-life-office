import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/users/infrastructure/persistence/relational/entities/user.entity';
import { AccountNotificationRelationalRepository } from './repositories/account-notification.repository';
import { AccountNotificationEntity } from './entities/account-notification.entity';
import { AccountNotificationRepository } from '../account-notification.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AccountNotificationEntity, UserEntity])],
  providers: [
    {
      provide: AccountNotificationRepository,
      useClass: AccountNotificationRelationalRepository,
    },
  ],
  exports: [AccountNotificationRepository],
})
export class RelationalAccountNotificationPersistenceModule {}
