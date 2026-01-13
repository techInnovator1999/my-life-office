import { FileType } from '@/files/domain/file';
import { EmailAttachment } from './relational/entities/email-attachment.entity';
import { Email } from './relational/entities/mail.entity';

export abstract class EmailAttachmentRepository {
  abstract create(data: {
    file: FileType;
    email: Email;
  }): Promise<EmailAttachment>;
}
