import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailAttachment } from './entities/email-attachment.entity';
import { EmailAttachmentRepository } from '../email-attachment.repository';
import { EmailAttachmentRelationalRepository } from './repositories/email-attachment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EmailAttachment])],
  providers: [
    {
      provide: EmailAttachmentRepository,
      useClass: EmailAttachmentRelationalRepository,
    },
  ],
  exports: [EmailAttachmentRepository],
})
export class RelationalEmailAttachmentPersistenceModule {}
