import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountManagerEntity } from './persistence/relational/entities/account-manager.entity';
import { UsersModule } from '@/users/users.module';
import { MailModule } from '@/mail/mail.module';
import { RelationalAccountManagerPersistenceModule } from './persistence/relational/relational-persistence.module';
import { AccountManagerController } from './account-manager.controller';
import { AccountManagerService } from './account-manager.service';

@Module({
  imports: [
    UsersModule,
    MailModule,
    TypeOrmModule.forFeature([AccountManagerEntity]),
    RelationalAccountManagerPersistenceModule,
  ],
  controllers: [AccountManagerController],
  providers: [AccountManagerService],
  exports: [AccountManagerService, RelationalAccountManagerPersistenceModule],
})
export class AccountManagerModule {}
