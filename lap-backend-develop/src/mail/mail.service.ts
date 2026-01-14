import { EmailNameEnum } from '@/email-template/email-template.enum';
import { EmailTemplateService } from '@/email-template/email-template.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nContext } from 'nestjs-i18n';
import fs from 'node:fs/promises';
import path from 'path';
import { AllConfigType } from 'src/config/config.type';
import { MailerService } from '../mailer/mailer.service';
import { QueueService } from '../queue/queue.service';
import { MaybeType } from '../utils/types/maybe.type';
import { AdminApprovalDto } from './dto/admin-approval.dto';
import { AdminNotifyDto } from './dto/admin-notify.dto';
import { DefaultTagsDto } from './dto/default-tags.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { PaymentFailedDto } from './dto/payment-failed.dto';
import { UserActivatedDto } from './dto/user-activated.dto';
import { UserDeactivatedDto } from './dto/user-deactivated.dto';
import { UserSignupDto } from './dto/user-signup.dto';
import { UserSuspendedDto } from './dto/user-suspended.dto';
import { UserTempSignUpDto } from './dto/user-temp-signup.dto';
import { UserUnsuspendedDto } from './dto/user-unsuspended.dto';
import { MailData } from './interfaces/mail-data.interface';
import { S3FileService } from '@/files/s3-files.service';
// import { EmailAttachment } from '../infrastructure/persistence/email-attachment.repository;
import { EmailAttachmentRepository } from './infrastructure/persistence/email-attachment.repository';
import { FileRepository } from '@/files/infrastructure/persistence/file.repository';
import { EmailRepository } from './infrastructure/persistence/email.repository';
import { UserAccountDeactivatedDto } from './dto/user-account-deactivated.dto';
import { UserDeletedDto } from './dto/user-deleted.dto';
import { UserAccountAbandonedDto } from './dto/user-account-abandoned.dto';
import { CrmAgentSignupDto } from './dto/crm-agent-signup.dto';

@Injectable()
export class MailService {
  private readonly templatePathMap = {};
  private readonly defaultTags: DefaultTagsDto;

  constructor(
    private readonly mailerService: MailerService,
    private emailTemplateService: EmailTemplateService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly queueService: QueueService,
    private readonly s3FileService: S3FileService,
    // @InjectRepository(Email) private emailRepository: Repository<Email>,
    private readonly emailRepository: EmailRepository,
    private readonly fileRepository: FileRepository,
    // @InjectRepository(FileEntity) private fileRepository: Repository<FileEntity>,
    private readonly emailAttachmentRepository: EmailAttachmentRepository,
  ) {
    const workingDirectory = this.configService.getOrThrow(
      'app.workingDirectory',
      {
        infer: true,
      },
    );

    this.templatePathMap = {
      [EmailNameEnum.USER_REGISTERED_USER]: path.join(
        workingDirectory,
        'src',
        'mail',
        'mail-templates',
        'account-register.hbs',
      ),
      [EmailNameEnum.USER_REGISTERED_PARTNER]: path.join(
        workingDirectory,
        'src',
        'mail',
        'mail-templates',
        'activation.hbs',
      ),
      [EmailNameEnum.USER_REGISTERED_ADMIN]: path.join(
        workingDirectory,
        'src',
        'mail',
        'mail-templates',
        'activation-admin.hbs',
      ),
      [EmailNameEnum.SUPPORT_EMAIL_CLIENT]: path.join(
        workingDirectory,
        'src',
        'mail',
        'mail-templates',
        'support-email-client.hbs',
      ),
      [EmailNameEnum.SUPPORT_EMAIL_ADMIN]: path.join(
        workingDirectory,
        'src',
        'mail',
        'mail-templates',
        'support-email-admin.hbs',
      ),
      [EmailNameEnum.ACCOUNT_MANAGER_INVITE]: path.join(
        workingDirectory,
        'src',
        'mail',
        'mail-templates',
        'account-manager-activation.hbs',
      ),
      [EmailNameEnum.FORGOT_PASSWORD]: path.join(
        workingDirectory,
        'src',
        'mail',
        'mail-templates',
        'forgot-password.hbs',
      ),
      [EmailNameEnum.ADMIN_APPROVAL]: path.join(
        workingDirectory,
        'src',
        'mail',
        'mail-templates',
        'activation.hbs',
      ),
      [EmailNameEnum.PAYMENT_FAILED]: path.join(
        workingDirectory,
        'src',
        'mail',
        'mail-templates',
        'payment-failed.hbs',
      ),
      [EmailNameEnum.USER_DEACTIVATED]: path.join(
        workingDirectory,
        'src',
        'mail',
        'mail-templates',
        'user-deactivated.hbs',
      ),
      [EmailNameEnum.USER_ACTIVATED]: path.join(
        workingDirectory,
        'src',
        'mail',
        'mail-templates',
        'user-activated.hbs',
      ),
      [EmailNameEnum.USER_SUSPENDED]: path.join(
        workingDirectory,
        'src',
        'mail',
        'mail-templates',
        'user-suspended.hbs',
      ),
      [EmailNameEnum.USER_UNSUSPENDED]: path.join(
        workingDirectory,
        'src',
        'mail',
        'mail-templates',
        'user-unsuspended.hbs',
      ),
      [EmailNameEnum.USER_ACCOUNT_DEACTIVATED]: path.join(
        workingDirectory,
        'src',
        'mail',
        'mail-templates',
        'user-account-deactivated.hbs',
      ),
      [EmailNameEnum.USER_ACCOUNT_ABANDONED]: path.join(
        workingDirectory,
        'src',
        'mail',
        'mail-templates',
        'user-abandoned.hbs',
      ),
      [EmailNameEnum.USER_ACCOUNT_DELETED]: path.join(
        workingDirectory,
        'src',
        'mail',
        'mail-templates',
        'user-account-deleted.hbs',
      ),
      [EmailNameEnum.CRM_AGENT_SIGNUP]: path.join(
        workingDirectory,
        'src',
        'mail',
        'mail-templates',
        'account-register.hbs',
      ),
    };
    this.defaultTags = {
      frontendAdminDomain: new URL(
        this.configService.getOrThrow('app.frontendAdminDomain', {
          infer: true,
        }),
      ).toString(),
      backendDomain: new URL(
        this.configService.getOrThrow('app.backendDomain', {
          infer: true,
        }),
      ).toString(),
      logoUrl:
        this.configService.getOrThrow('app.backendDomain', { infer: true }) +
        '/static/mail/logo-white.png',
      appName: this.configService.get('app.name', { infer: true }) ?? '',
      url: new URL(
        this.configService.getOrThrow('app.frontendClientDomain', {
          infer: true,
        }),
      ).toString(),
      frontendClientDomain:
        this.configService.get('app.frontendClientDomain', {
          infer: true,
        }) ?? '',
    };
  }

  async GetTemplateHTMLAndSubject(emailName: EmailNameEnum): Promise<{
    html: string;
    subject: string | null;
  }> {
    const template = await this.emailTemplateService.findOne({
      name: emailName,
    });
    let html = template?.html;
    if (!html) {
      const templatePath = this.templatePathMap[emailName];
      html = await fs.readFile(templatePath, 'utf-8');
    }
    return {
      html,
      subject: template?.subject ?? null,
    };
  }

  async fetchTranslations(
    i18n: I18nContext | undefined,
    keys: string[],
  ): Promise<MaybeType<string>[]> {
    if (i18n) {
      return Promise.all(keys.map((key) => i18n.t(key)));
    }
    return keys.map(() => undefined);
  }

  async sendEmailWithTranslations<T>(
    mailerService: MailerService,
    mailData: MailData<T>,
    translationKeys: string[],
    emailTemplateName: EmailNameEnum,
    i18n: I18nContext | undefined,
    defaultTags: any,
    url?: URL | string,
    attachments?: {
      filename: string;
      content: Buffer | string;
    }[],
  ): Promise<void> {
    const translations = await this.fetchTranslations(i18n, translationKeys);

    const [emailConfirmTitle, ...texts] = translations;

    const { html, subject } =
      await this.GetTemplateHTMLAndSubject(emailTemplateName);

    url = url ? url : this.defaultTags.url;

    const emailData: Record<string, unknown> = {
      to: mailData.to,
      subjectTemplate: subject ?? emailConfirmTitle,
      text: `${url?.toString() || ''} ${emailConfirmTitle}`,
      bodyTemplate: html,
      context: {
        ...defaultTags,
        ...mailData.data,
        emailConfirmTitle,
        ...texts.reduce(
          (acc, text, index) => ({ ...acc, [`text${index + 1}`]: text }),
          {},
        ),
      },
    };

    if (mailData.cc) emailData.cc = mailData.cc;

    const email = await this.emailRepository.create(emailData);

    if (attachments && attachments.length > 0) {
      for (const att of attachments) {
        const url = await this.s3FileService.uploadFileFromBuffer(
          att.content as Buffer,
          att.filename,
          'application/pdf',
        );
        const file = await this.fileRepository.create({ path: url });

        await this.emailAttachmentRepository.create({
          file,
          email,
        });
      }
    }
    await this.queueService.addEmailJob({ id: email.id });
  }

  async sendEmailWithoutTranslations(
    emailType: EmailNameEnum,
    emailDetails: {
      to: string;
      cc?: string;
      from?: {
        name: string | undefined;
        address: string | undefined;
      };
      subject?: string;
      context: object;
      htmlUser?: string;
      attachments?: Array<{ filename: string; content: Buffer }>;
    },
  ): Promise<void> {
    try {
      const { html, subject } = await this.GetTemplateHTMLAndSubject(emailType);

      const emailData: Record<string, unknown> = {
        to: emailDetails.to,
        cc: emailDetails.cc,
        from: emailDetails.from,
        subjectTemplate: subject ?? emailDetails.subject,
        bodyTemplate: html ?? emailDetails.htmlUser,
        context: {
          ...this.defaultTags,
          ...emailDetails.context,
        },
      };

      const email = await this.emailRepository.create(emailData);

      if (emailDetails.attachments && emailDetails.attachments.length > 0) {
        for (const att of emailDetails.attachments) {
          const url = await this.s3FileService.uploadFileFromBuffer(
            att.content as Buffer,
            att.filename,
            'application/pdf',
          );
          const file = await this.fileRepository.create({ path: url });

          await this.emailAttachmentRepository.create({
            file,
            email,
          });
        }
      }
      console.log('🚀 ~ MailService ~ file:');

      await this.queueService.addEmailJob({ id: email.id });
    } catch (error) {
      console.log(error);
    }
  }

  async AdminNotify(mailData: MailData<AdminNotifyDto>): Promise<void> {
    const i18n = I18nContext.current();

    const translationKeys = [
      'common.UserRegistered',
      'confirm-email-admin.text1',
      'confirm-email-admin.text2',
      'confirm-email-admin.text3',
      'confirm-email-admin.text4',
      'confirm-email-admin.text5',
      'confirm-email-admin.text6',
      'confirm-email-admin.text7',
      'confirm-email-admin.text8',
      'confirm-email-admin.text9',
      'confirm-email-admin.text10',
      'confirm-email-admin.text11',
      'confirm-email-admin.text12',
      'confirm-email-admin.text13',
    ];

    await this.sendEmailWithTranslations(
      this.mailerService,
      mailData,
      translationKeys,
      EmailNameEnum.USER_REGISTERED_ADMIN,
      i18n,
      this.defaultTags,
    );
  }

  async AdminApproval(mailData: MailData<AdminApprovalDto>): Promise<void> {
    const i18n = I18nContext.current();

    const translationKeys = [
      'common.UserRegistered',
      'confirm-email-admin.text1',
      'confirm-email-admin.text2',
      'confirm-email-admin.text3',
      'confirm-email-admin.text4',
      'confirm-email-admin.text5',
      'confirm-email-admin.text6',
      'confirm-email-admin.text7',
      'confirm-email-admin.text8',
      'confirm-email-admin.text9',
      'confirm-email-admin.text10',
      'confirm-email-admin.text11',
    ];

    await this.sendEmailWithTranslations(
      this.mailerService,
      mailData,
      translationKeys,
      EmailNameEnum.ADMIN_APPROVAL,
      i18n,
      this.defaultTags,
    );
  }

  async userSignUp(mailData: MailData<UserSignupDto>): Promise<void> {
    const i18n = I18nContext.current();

    const translationKeys = [
      'common.confirmEmail',
      'confirm-email.text1',
      'confirm-email.text2',
      'confirm-email.text3',
      'confirm-email.text4',
      'confirm-email.text5',
      'confirm-email.text6',
      'confirm-email.text7',
      'confirm-email.text8',
      'confirm-email.text9',
    ];

    await this.sendEmailWithTranslations(
      this.mailerService,
      mailData,
      translationKeys,
      EmailNameEnum.USER_REGISTERED_USER,
      i18n,
      this.defaultTags,
    );
  }

  async userTempSignUp(mailData: MailData<UserTempSignUpDto>): Promise<void> {
    const i18n = I18nContext.current();

    const translationKeys = [
      'common.confirmEmail',
      'confirm-account-manager.text1',
      'confirm-account-manager.text2',
      'confirm-account-manager.text3',
      'confirm-account-manager.text4',
      'confirm-account-manager.text5',
      'confirm-account-manager.text6',
      'confirm-account-manager.text7',
      'confirm-account-manager.text8',
    ];

    await this.sendEmailWithTranslations(
      this.mailerService,
      mailData,
      translationKeys,
      EmailNameEnum.ACCOUNT_MANAGER_INVITE,
      i18n,
      this.defaultTags,
    );
  }

  async forgotPassword(mailData: MailData<ForgotPasswordDto>): Promise<void> {
    const i18n = I18nContext.current();

    const translationKeys = [
      'common.resetPassword',
      'reset-password.text1',
      'reset-password.text2',
      'reset-password.text3',
      'reset-password.text4',
      'reset-password.text5',
      'reset-password.text6',
      'reset-password.text7',
      'reset-password.text8',
    ];

    await this.sendEmailWithTranslations(
      this.mailerService,
      mailData,
      translationKeys,
      EmailNameEnum.FORGOT_PASSWORD,
      i18n,
      this.defaultTags,
    );
  }

  async paymentFailedEmail(
    mailData: MailData<PaymentFailedDto>,
  ): Promise<void> {
    await this.sendEmailWithoutTranslations(EmailNameEnum.PAYMENT_FAILED, {
      to: mailData.to,
      cc: mailData.cc,
      subject: 'Payment Failed',
      context: {
        ...this.defaultTags,
        ...mailData.data,
      },
    });
  }
  async userActivatedEmail(
    mailData: MailData<UserActivatedDto>,
  ): Promise<void> {
    await this.sendEmailWithoutTranslations(EmailNameEnum.USER_ACTIVATED, {
      to: mailData.to,
      cc: mailData.cc,
      subject: 'Account Activated',
      context: {
        ...this.defaultTags,
        ...mailData.data,
      },
    });
  }

  async userDeactivatedEmail(
    mailData: MailData<UserDeactivatedDto>,
  ): Promise<void> {
    await this.sendEmailWithoutTranslations(EmailNameEnum.USER_DEACTIVATED, {
      to: mailData.to,
      cc: mailData.cc,
      subject:
        'Account Suspended Your Life Agent Portal Account has been suspended',
      context: {
        ...this.defaultTags,
        ...mailData.data,
      },
    });
  }

  async userDeletedEmail(mailData: MailData<UserDeletedDto>): Promise<void> {
    await this.sendEmailWithoutTranslations(
      EmailNameEnum.USER_ACCOUNT_DELETED,
      {
        to: mailData.to,
        cc: mailData.cc,
        subject:
          'Account Deleted Your Life Agent Portal Account has been deleted',
        context: {
          ...this.defaultTags,
          ...mailData.data,
        },
      },
    );
  }

  async userSuspendedEmail(
    mailData: MailData<UserSuspendedDto>,
  ): Promise<void> {
    await this.sendEmailWithoutTranslations(EmailNameEnum.USER_SUSPENDED, {
      to: mailData.to,
      cc: mailData.cc,
      subject: 'Account Suspended',
      context: {
        ...this.defaultTags,
        ...mailData.data,
      },
    });
  }

  async userUnsuspendedEmail(
    mailData: MailData<UserUnsuspendedDto>,
  ): Promise<void> {
    await this.sendEmailWithoutTranslations(EmailNameEnum.USER_UNSUSPENDED, {
      to: mailData.to,
      cc: mailData.cc,
      context: {
        ...this.defaultTags,
        ...mailData.data,
      },
      subject: 'Account Unsuspended',
    });
  }

  async userAccountDeactivatedEmail(
    mailData: MailData<UserAccountDeactivatedDto>,
  ): Promise<void> {
    await this.sendEmailWithoutTranslations(
      EmailNameEnum.USER_ACCOUNT_DEACTIVATED,
      {
        to: mailData.to,
        cc: mailData.cc,
        subject:
          'Inactivity notice Action Required for Your Life Agent Portal Account',
        context: {
          ...this.defaultTags,
          ...mailData.data,
        },
      },
    );
  }
  async userAccountAbandonedEmail(
    mailData: MailData<UserAccountAbandonedDto>,
  ): Promise<void> {
    await this.sendEmailWithoutTranslations(
      EmailNameEnum.USER_ACCOUNT_ABANDONED,
      {
        to: mailData.to,
        cc: mailData.cc,
        subject:
          'Inactivity notice Action Required for Your Life Agent Portal Account',
        context: {
          ...this.defaultTags,
          ...mailData.data,
        },
      },
    );
  }

  async crmAgentSignUp(mailData: MailData<CrmAgentSignupDto>): Promise<void> {
    const i18n = I18nContext.current();

    const translationKeys = [
      'common.confirmEmail',
      'confirm-email.text1',
      'confirm-email.text2',
      'confirm-email.text3',
      'confirm-email.text4',
      'confirm-email.text5',
      'confirm-email.text6',
      'confirm-email.text7',
      'confirm-email.text8',
      'confirm-email.text9',
    ];

    await this.sendEmailWithTranslations(
      this.mailerService,
      mailData,
      translationKeys,
      EmailNameEnum.CRM_AGENT_SIGNUP,
      i18n,
      {
        ...this.defaultTags,
        headerColor: '#307fef', // Primary color for CRM agent portal
        headerTitle: 'Welcome to CRM Agent Portal', // Hardcoded title for CRM
        showAdminNote: true, // Show admin approval note for CRM agents
      },
    );
  }
}
