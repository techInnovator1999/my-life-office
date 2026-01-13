import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import { AllConfigType } from 'src/config/config.type';
import { Email } from '@/mail/infrastructure/persistence/relational/entities/mail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isNonEmptyObject } from '@/utils/util.helper';

@Injectable()
export class MailerService {
  private readonly transporter: nodemailer.Transporter;
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    @InjectRepository(Email) private emailRepository: Repository<Email>,
  ) {
    const mailHost = configService.get('mail.host', { infer: true });
    const mailUser = configService.get('mail.user', { infer: true });
    const mailPassword = configService.get('mail.password', { infer: true });
    
    // Check if mail configuration is missing
    if (!mailHost || !mailUser || !mailPassword) {
      console.warn('⚠️  WARNING: Email configuration is missing!');
      console.warn('Please configure the following environment variables:');
      console.warn('  - MAIL_HOST (e.g., smtp.sendgrid.net)');
      console.warn('  - MAIL_USER (e.g., apikey for SendGrid)');
      console.warn('  - MAIL_PASSWORD (your SMTP password/API key)');
      console.warn('  - MAIL_PORT (e.g., 587)');
      console.warn('  - MAIL_DEFAULT_EMAIL (sender email)');
      console.warn('  - MAIL_DEFAULT_NAME (sender name)');
      console.warn('Registration will succeed but emails will not be sent.');
    }
    
    const createTransportParams = {
      service: configService.get('mail.service', { infer: true }),
      host: mailHost,
      port: configService.get('mail.port', { infer: true }),
      ignoreTLS: configService.get('mail.ignoreTLS', { infer: true }),
      secure: configService.get('mail.secure', { infer: true }),
      requireTLS: configService.get('mail.requireTLS', { infer: true }),
      auth: {
        user: mailUser,
        pass: mailPassword,
      },
    };
    this.transporter = nodemailer.createTransport(createTransportParams);
  }

  async sendMail(
    {
      template,
      context,
      ...mailOptions
    }: nodemailer.SendMailOptions & {
      template?: string;
      context?: Record<string, unknown>;
    },
    id?: string,
  ): Promise<void> {
    let html: string | undefined;
    let subjectTemplate = '';
    let subjectCompiled = '';

    if (template) {
      // const template = await fs.readFile(templatePath, 'utf-8');
      html = Handlebars.compile(template, {
        strict: false,
      })(context);
    }
    if (mailOptions.subject) {
      subjectTemplate = mailOptions.subject;

      subjectCompiled = Handlebars.compile(mailOptions.subject, {
        strict: false,
      })(context);
      mailOptions.subject = subjectCompiled;
    }

    const emailData: Partial<Email> = {
      body: html,
      bodyTemplate: template,
      subject: subjectCompiled,
      subjectTemplate: subjectTemplate,
      context,
    };

    try {
      const transportParams: any = {
        ...mailOptions,
        from:
          id && isNonEmptyObject(mailOptions.from)
            ? JSON.parse(mailOptions.from)
            : isNonEmptyObject(mailOptions.from)
              ? mailOptions.from
              : {
                  name: this.configService.get('mail.defaultName', {
                    infer: true,
                  }),
                  address: this.configService.get('mail.defaultEmail', {
                    infer: true,
                  }),
                },
        html: mailOptions.html ? mailOptions.html : html,
      };
      await this.transporter.sendMail(transportParams);
      emailData.sentAt = new Date();
      console.log('Mail Send Successfully');
    } catch (error) {
      if (error instanceof Error) {
        emailData.stack = JSON.stringify(error.stack);
        emailData.error = error.message;
        emailData.failedAt = new Date();
        console.error('Mail sending error:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Mail configuration:', {
          host: this.configService.get('mail.host', { infer: true }),
          port: this.configService.get('mail.port', { infer: true }),
          user: this.configService.get('mail.user', { infer: true }),
          hasPassword: !!this.configService.get('mail.password', { infer: true }),
        });
      }

      throw new BadRequestException(`Mail could not be send: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      void (async () => {
        try {
          if (id) await this.emailRepository.update({ id }, emailData);
        } catch {}
      })();
    }
  }
}
