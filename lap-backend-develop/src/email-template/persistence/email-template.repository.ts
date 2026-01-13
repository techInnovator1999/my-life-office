import { NullableType } from 'src/utils/types/nullable.type';
import { DeepPartial } from 'src/utils/types/deep-partial.type';
import { EmailTemplate } from '../domain/email-template';
import { GetEmailTemplateDto } from '../dto/get-email-template.dto';
import { FindOptionsWhere } from 'typeorm';
import { EmailTemplateEntity } from './relational/entities/email-template.entity';
import { SortEmailTemplateDto } from '../dto/query-email-template.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { EntityCondition } from '@/utils/types/entity-condition.type';
export abstract class EmailTemplateRepository {
  abstract create(
    data: Omit<
      EmailTemplate,
      'id' | 'createdAt' | 'deletedAt' | 'updatedAt' | 'json'
    >,
  ): Promise<EmailTemplate>;

  abstract findOne(
    fields: EntityCondition<EmailTemplate>,
  ): Promise<NullableType<EmailTemplate>>;
  abstract findMany(): Promise<NullableType<GetEmailTemplateDto[]>>;

  abstract exists(fields: FindOptionsWhere<EmailTemplate>): Promise<boolean>;

  abstract update(
    // id: EmailTemplate['id'],
    whereParams:
      | FindOptionsWhere<EmailTemplateEntity>
      | FindOptionsWhere<EmailTemplateEntity>[],
    payload: DeepPartial<EmailTemplate>,
  ): Promise<boolean>;

  abstract findManyWithPagination({
    userId,
    status,
    sortOptions,
    paginationOptions,
  }: {
    userId?: string | null;
    status?: string | null;
    sortOptions?: SortEmailTemplateDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<{ total: number; data: GetEmailTemplateDto[] }>;

  abstract softDelete(id: EmailTemplate['id']): Promise<void>;
}
