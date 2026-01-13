import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { NullableType } from '@/utils/types/nullable.type';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { EmailTemplateEntity } from '../entities/email-template.entity';
import { EmailTemplate } from '@/email-template/domain/email-template';
import { EmailTemplateMapper } from '../mappers/email-template.mapper';
import { SortEmailTemplateDto } from '@/email-template/dto/query-email-template.dto';
import { GetEmailTemplateDto } from '@/email-template/dto/get-email-template.dto';
import { EmailTemplateRepository } from '../../email-template.repository';
import { EntityCondition } from '@/utils/types/entity-condition.type';

@Injectable()
export class EmailTemplateRelationalRepository
  implements EmailTemplateRepository
{
  constructor(
    @InjectRepository(EmailTemplateEntity)
    private readonly emailTemplateRepository: Repository<EmailTemplateEntity>,
  ) {}

  async create(data: EmailTemplate): Promise<EmailTemplate> {
    const persistenceModel = EmailTemplateMapper.toPersistence(data);
    const newEntity = await this.emailTemplateRepository.save(
      this.emailTemplateRepository.create(persistenceModel),
    );

    return EmailTemplateMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    sortOptions,
    paginationOptions,
  }: {
    userId?: string | null;
    sortOptions?: SortEmailTemplateDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<{ total: number; data: any[] }> {
    const where: FindOptionsWhere<EmailTemplateEntity> = {};

    const total: number = await this.emailTemplateRepository.count({
      where: where,
    });

    // Retrieve paginated entities
    const entities: any[] = await this.emailTemplateRepository.find({
      where: where,
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    const data = entities.map((pkg) => EmailTemplateMapper.toDomainMany(pkg));
    return { total, data };
  }
  async findOne(
    fields: EntityCondition<EmailTemplate>,
  ): Promise<NullableType<EmailTemplate>> {
    const entity = await this.emailTemplateRepository.findOne({
      where: fields as FindOptionsWhere<EmailTemplateEntity>,
    });

    return entity ? EmailTemplateMapper.toDomain(entity) : null;
  }

  async findMany(): Promise<NullableType<GetEmailTemplateDto[]>> {
    const entities = await this.emailTemplateRepository.find({});

    const data = entities.map((pkg) => EmailTemplateMapper.toDomainMany(pkg));

    return data;
  }

  async exists(fields: FindOptionsWhere<EmailTemplate>): Promise<boolean> {
    const isExist = await this.emailTemplateRepository.exists({
      where: fields,
    });

    return isExist;
  }

  async update(
    whereParams:
      | FindOptionsWhere<EmailTemplateEntity>
      | FindOptionsWhere<EmailTemplateEntity>[],
    payload: Partial<EmailTemplate>,
  ): Promise<boolean> {
    const entity = await this.emailTemplateRepository.findOne({
      where: whereParams,
    });

    if (!entity) {
      throw new NotFoundException('EmailTemplate not found');
    }

    const updatedData = EmailTemplateMapper.toPersistence({
      ...EmailTemplateMapper.toDomain(entity),
      ...payload,
    });

    // Assign the updated data to the existing entity
    Object.assign(entity, updatedData);

    // Save the updated entity
    await this.emailTemplateRepository.save(entity);

    return true;
  }

  async softDelete(id: EmailTemplate['id']): Promise<void> {
    await this.emailTemplateRepository.softDelete(id);
  }
}
