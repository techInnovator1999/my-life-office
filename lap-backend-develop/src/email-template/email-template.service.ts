import { BadRequestException, Injectable } from '@nestjs/common';
import { EmailTemplateRepository } from './persistence/email-template.repository';
import { EmailTemplate } from './domain/email-template';
import { NullableType } from '@/utils/types/nullable.type';
import { DeepPartial } from 'typeorm';
import { GetEmailTemplateDto } from './dto/get-email-template.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { SortEmailTemplateDto } from './dto/query-email-template.dto';
import { CreateEmailTemplateDto } from './dto/create-email-template.dto';
import Handlebars from 'handlebars';
import { EntityCondition } from '@/utils/types/entity-condition.type';
import { EmailNameEnum } from './email-template.enum';
import { AdminNotifyDto } from '@/mail/dto/admin-notify.dto';
import { UserSignupDto } from '@/mail/dto/user-signup.dto';
import { UserTempSignUpDto } from '@/mail/dto/user-temp-signup.dto';
import { ForgotPasswordDto } from '@/mail/dto/forgot-password.dto';
import { AdminApprovalDto } from '@/mail/dto/admin-approval.dto';
import { PaymentFailedDto } from '@/mail/dto/payment-failed.dto';
import { UserDeactivatedDto } from '@/mail/dto/user-deactivated.dto';
import { UserActivatedDto } from '@/mail/dto/user-activated.dto';
import { UserSuspendedDto } from '@/mail/dto/user-suspended.dto';
import { UserUnsuspendedDto } from '@/mail/dto/user-unsuspended.dto';

@Injectable()
export class EmailTemplateService {
  private readonly templateDtoMap: Record<string, any>;
  constructor(
    private readonly emailTemplateRepository: EmailTemplateRepository,
  ) {
    this.templateDtoMap = {
      [EmailNameEnum.USER_REGISTERED_USER]: UserSignupDto,
      [EmailNameEnum.USER_REGISTERED_ADMIN]: AdminNotifyDto,
      [EmailNameEnum.USER_REGISTERED_PARTNER]: UserSignupDto,
      [EmailNameEnum.ACCOUNT_MANAGER_INVITE]: UserTempSignUpDto,
      [EmailNameEnum.FORGOT_PASSWORD]: ForgotPasswordDto,
      [EmailNameEnum.ADMIN_APPROVAL]: AdminApprovalDto,
      [EmailNameEnum.PAYMENT_FAILED]: PaymentFailedDto,
      [EmailNameEnum.USER_DEACTIVATED]: UserDeactivatedDto,
      [EmailNameEnum.USER_ACTIVATED]: UserActivatedDto,
      [EmailNameEnum.USER_SUSPENDED]: UserSuspendedDto,
      [EmailNameEnum.USER_UNSUSPENDED]: UserUnsuspendedDto,
    };
  }

  validateStringWithDto(str: string, emailName: EmailNameEnum) {
    try {
      const dto = new this.templateDtoMap[emailName]();
      Handlebars.compile(str, { strict: true })(dto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  getAvailableTags(emailNameEnum: EmailNameEnum): string[] {
    const dto = new this.templateDtoMap[emailNameEnum]();
    return Object.keys(dto);
  }

  async create(createEmailTemplateDto: CreateEmailTemplateDto): Promise<any> {
    const alreadyExists = await this.emailTemplateRepository.exists({
      name: createEmailTemplateDto.name,
    });
    if (alreadyExists) {
      throw new BadRequestException(
        'Email template with this name already exists',
      );
    }
    if (createEmailTemplateDto.html) {
      await this.validateStringWithDto(
        createEmailTemplateDto.html,
        createEmailTemplateDto.name,
      );
    }
    if (createEmailTemplateDto.subject) {
      await this.validateStringWithDto(
        createEmailTemplateDto.subject,
        createEmailTemplateDto.name,
      );
    }
    await this.emailTemplateRepository.create(createEmailTemplateDto);
    return true;
  }

  findOne(
    fields: EntityCondition<EmailTemplate>,
  ): Promise<NullableType<EmailTemplate>> {
    return this.emailTemplateRepository.findOne(fields);
  }

  async findMany(): Promise<NullableType<GetEmailTemplateDto[]>> {
    return await this.emailTemplateRepository.findMany();
  }

  async softDelete(id: EmailTemplate['id']): Promise<void> {
    await this.emailTemplateRepository.softDelete(id);
  }

  async findManyWithPagination({
    sortOptions,
    paginationOptions,
  }: {
    sortOptions?: SortEmailTemplateDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<{ total: number; data: GetEmailTemplateDto[] }> {
    return await this.emailTemplateRepository.findManyWithPagination({
      sortOptions,
      paginationOptions,
    });
  }

  async update(
    id: EmailTemplate['id'],
    payload: DeepPartial<EmailTemplate>,
  ): Promise<boolean> {
    const clonedPayload = { ...payload };
    const name = (await this.emailTemplateRepository.findOne({ id }))?.name;
    if (!name) {
      throw new BadRequestException('Email template not found');
    }
    if (clonedPayload.html) {
      await this.validateStringWithDto(clonedPayload.html, name);
    }
    if (clonedPayload.subject) {
      await this.validateStringWithDto(clonedPayload.subject, name);
    }
    return this.emailTemplateRepository.update({ id }, clonedPayload);
  }
}
