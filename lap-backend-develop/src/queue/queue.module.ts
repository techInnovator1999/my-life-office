import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { BullModule } from '@nestjs/bullmq';
import { MailProcessor } from './mail.processor';
import { MailerModule } from '@/mailer/mailer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from '@/mail/infrastructure/persistence/relational/entities/mail.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailAttachment } from '@/mail/infrastructure/persistence/relational/entities/email-attachment.entity';
import { FilesModule } from '@/files/files.module';
import { FileEntity } from '@/files/infrastructure/persistence/relational/entities/file.entity';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.getOrThrow<string>('REDIS_HOST', { infer: true }),
          port: configService.getOrThrow<number>('REDIS_PORT', { infer: true }),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'mail-queue',
    }),
    MailerModule,
    TypeOrmModule.forFeature([Email, EmailAttachment, FileEntity]),
    FilesModule,
  ],
  providers: [QueueService, MailProcessor],
  exports: [QueueService],
})
export class QueueModule {}
