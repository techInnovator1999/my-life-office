import { GetEmailTemplateDto } from '@/email-template/dto/get-email-template.dto';
import { EmailTemplateEntity } from '../entities/email-template.entity';
import { EmailTemplate } from '@/email-template/domain/email-template';

export class EmailTemplateMapper {
  static toDomain(raw: EmailTemplateEntity): EmailTemplate {
    const emailTemplate = new EmailTemplate();
    emailTemplate.id = raw.id;
    emailTemplate.name = raw.name;
    emailTemplate.html = raw.html;
    emailTemplate.subject = raw.subject;
    emailTemplate.json = raw.json;
    emailTemplate.updatedAt = raw.updatedAt;
    emailTemplate.createdAt = raw.createdAt;
    return emailTemplate;
  }

  static toDomainMany(raw: EmailTemplateEntity): GetEmailTemplateDto {
    const emailTemplate = new GetEmailTemplateDto();
    emailTemplate.id = raw.id;
    emailTemplate.subject = raw.subject;
    emailTemplate.html = raw.html;
    emailTemplate.json = raw.json;
    emailTemplate.name = raw.name;
    emailTemplate.createdAt = raw.createdAt;
    return emailTemplate;
  }

  static toPersistence(emailTemplate: EmailTemplate): EmailTemplateEntity {
    const emailTemplateEntity = new EmailTemplateEntity();
    emailTemplateEntity.id = emailTemplate.id;
    emailTemplateEntity.name = emailTemplate.name;
    emailTemplateEntity.subject = emailTemplate.subject;
    emailTemplateEntity.html = emailTemplate.html;
    emailTemplateEntity.json = emailTemplate.json;

    return emailTemplateEntity;
  }
}
