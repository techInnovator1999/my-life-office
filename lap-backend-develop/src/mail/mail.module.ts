import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
import { MailerModule } from '../mailer/mailer.module';
import { EmailTemplateModule } from '@/email-template/email-template.module';
import { MailController } from './mail.controller';
import { QueueModule } from '@/queue/queue.module';
import { MailerService } from '@/mailer/mailer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from './infrastructure/persistence/relational/entities/mail.entity';
import { FilesModule } from '@/files/files.module';
import { EmailAttachment } from './infrastructure/persistence/relational/entities/email-attachment.entity';
import { FileEntity } from '@/files/infrastructure/persistence/relational/entities/file.entity';
import { RelationalEmailAttachmentPersistenceModule } from './infrastructure/persistence/relational/email.attachments.relational.persistence.module.ts';
import { RelationalEmailPersistenceModule } from './infrastructure/persistence/relational/email.relational.persistence.module';
import { UsersModule } from '@/users/users.module';
import { EmailTemplateService } from '@/email-template/email-template.service';

@Module({
  imports: [
    ConfigModule,
    MailerModule,
    QueueModule,
    TypeOrmModule.forFeature([Email, EmailAttachment, FileEntity]),
    FilesModule,
    RelationalEmailAttachmentPersistenceModule,
    RelationalEmailPersistenceModule,
    EmailTemplateModule,
    forwardRef(() => UsersModule),
  ],
  providers: [MailService, MailerService, EmailTemplateService],
  exports: [
    MailService,
    RelationalEmailAttachmentPersistenceModule,
    RelationalEmailPersistenceModule,
  ],
  controllers: [MailController],
})
export class MailModule {}
