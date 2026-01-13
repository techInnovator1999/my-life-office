import { S3FileService } from '@/files/s3-files.service';
import { EmailAttachment } from '@/mail/infrastructure/persistence/relational/entities/email-attachment.entity';
import { Email } from '@/mail/infrastructure/persistence/relational/entities/mail.entity';
import { MailerService } from '@/mailer/mailer.service';
import { extractKeyFromUrl, isNonEmptyObject } from '@/utils/util.helper';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
@Processor('mail-queue')
export class MailProcessor extends WorkerHost {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(Email) private emailRepository: Repository<Email>,
    @InjectRepository(EmailAttachment)
    private emailAttachmentRepository: Repository<EmailAttachment>,
    private readonly s3FileService: S3FileService,
  ) {
    super();
  }

  async process(job: Job) {
    const { id } = job.data;

    try {
      const sendMailData = await this.emailRepository.findOneBy({
        id,
      });

      if (!sendMailData) throw new Error('Failed to send email');

      const { to, from, cc, subjectTemplate, bodyTemplate, context } =
        sendMailData;

      const dataToProcess: Record<string, unknown> = {
        to,
        subject: subjectTemplate,
        template: bodyTemplate,
        context: context,
      };

      const attachments = await this.emailAttachmentRepository.find({
        where: {
          email: { id },
        },
      });

      const attachmentData: {
        filename: string;
        content: Buffer | string;
      }[] = [];

      for (const att of attachments) {
        const key = extractKeyFromUrl(att.file.path);

        const buffer = await this.s3FileService.getFileBuffer(key);

        attachmentData.push({ filename: key, content: buffer });
      }

      if (attachmentData && attachmentData.length > 0)
        dataToProcess.attachments = attachmentData;
      if (isNonEmptyObject(from)) dataToProcess.from = JSON.stringify(from);
      if (cc) dataToProcess.cc = cc;

      console.log({ attachmentData });

      await this.mailerService.sendMail(dataToProcess, id);
      console.log(`Email successfully sent to ${to}`);
    } catch (error) {
      console.error(`Failed to send email`, error);
    }
  }
}
