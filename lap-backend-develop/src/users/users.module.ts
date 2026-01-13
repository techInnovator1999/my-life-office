import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { FilesModule } from '@/files/files.module';
import { UsersService } from './users.service';
import { RelationalUserPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from '@/mail/mail.module';
import { MailerModule } from '@/mailer/mailer.module';

@Module({
  imports: [
    ConfigModule,
    RelationalUserPersistenceModule,
    FilesModule,
    forwardRef(() => MailModule),
    MailerModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, RelationalUserPersistenceModule],
})
export class UsersModule {}
