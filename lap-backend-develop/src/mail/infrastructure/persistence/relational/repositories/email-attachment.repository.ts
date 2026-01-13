import { Injectable } from '@nestjs/common';
import { EmailAttachmentRepository } from '../../email-attachment.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailAttachment } from '../entities/email-attachment.entity';
import { Repository } from 'typeorm';
import { Email } from '../entities/mail.entity';
import { FileType } from '@/files/domain/file';

@Injectable()
export class EmailAttachmentRelationalRepository
  implements EmailAttachmentRepository
{
  constructor(
    @InjectRepository(EmailAttachment)
    private readonly emailAttachmentRepository: Repository<EmailAttachment>,
  ) {}

  async create(data: {
    file: FileType;
    email: Email;
  }): Promise<EmailAttachment> {
    return await this.emailAttachmentRepository.save(data);
  }
}
