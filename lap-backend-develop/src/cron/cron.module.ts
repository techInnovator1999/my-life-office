import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/users/infrastructure/persistence/relational/entities/user.entity';
import { MailModule } from '@/mail/mail.module';
import { MailerModule } from '@/mailer/mailer.module';
import { EmailTemplateModule } from '@/email-template/email-template.module';
import { QueueModule } from '@/queue/queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    MailModule,
    MailerModule,
    EmailTemplateModule,
    QueueModule,
  ],
  controllers: [],
  providers: [CronService],
  exports: [],
})
export class CronModule {}
