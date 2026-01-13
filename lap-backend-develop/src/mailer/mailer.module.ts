import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from '@/mail/infrastructure/persistence/relational/entities/mail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Email])],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
