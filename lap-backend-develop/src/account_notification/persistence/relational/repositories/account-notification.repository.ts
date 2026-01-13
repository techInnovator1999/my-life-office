import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { FindOptionsWhere, Repository } from 'typeorm';
import { NullableType } from '@/utils/types/nullable.type';
import { AccountNotification } from '@/account_notification/domain/account-notification';
import { AccountNotificationEntity } from '../entities/account-notification.entity';
import { AccountNotificationMapper } from '../mappers/account-notification.mapper';
import { AccountNotificationRepository } from '../../account-notification.repository';
import { SortAccountNotificationDto } from '@/account_notification/dto/query-account-notification.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { JwtPayloadType } from '@/auth/strategies/types/jwt-payload.type';

@Injectable()
export class AccountNotificationRelationalRepository
  implements AccountNotificationRepository
{
  constructor(
    @InjectRepository(AccountNotificationEntity)
    private readonly accountNotificationRepository: Repository<AccountNotificationEntity>,
  ) {}

  async create(data: AccountNotification): Promise<AccountNotification> {
    const persistenceModel = AccountNotificationMapper.toPersistence(data);
    const newEntity = await this.accountNotificationRepository.save(
      this.accountNotificationRepository.create(persistenceModel),
    );
    return AccountNotificationMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    sortOptions,
    paginationOptions,
    userJwtPayload,
  }: {
    sortOptions?: SortAccountNotificationDto[] | null;
    paginationOptions: IPaginationOptions;
    userJwtPayload: JwtPayloadType;
  }): Promise<{ total: number; data: any[] }> {
    const where: FindOptionsWhere<AccountNotificationEntity> = {};
    where.user = { id: userJwtPayload.id };
    const total: number = await this.accountNotificationRepository.count({
      where: where,
    });

    // Retrieve paginated entities
    const entities: any[] = await this.accountNotificationRepository.find({
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

    const data = entities.map((pkg) =>
      AccountNotificationMapper.toDomainMany(pkg),
    );

    const updatedData = data.map((item) => ({
      id: item.id,
      user: item.user,
      bodyKey: item.bodyKey,
      titleKey: item.titleKey,
      isRead: item.isRead,
      type: item.type,
      entityId: item.entityId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      data: item.data,
      title: '',
      body: '',
      placeHolderData: item.placeHolderData,
    }));

    return { total, data: updatedData };
  }

  async findOne(
    fields: EntityCondition<AccountNotification>,
  ): Promise<NullableType<AccountNotification>> {
    const entity = await this.accountNotificationRepository.findOne({
      where: fields as FindOptionsWhere<AccountNotificationEntity>,
    });

    return entity ? AccountNotificationMapper.toDomain(entity) : null;
  }

  async update(
    id: AccountNotification['id'],
    payload: Partial<AccountNotification>,
  ): Promise<AccountNotification> {
    const entity = await this.accountNotificationRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Data not found');
    }

    const updatedData = AccountNotificationMapper.toPersistence({
      ...AccountNotificationMapper.toDomain(entity),
      ...payload,
    });

    // Assign the updated data to the existing entity
    Object.assign(entity, updatedData);

    // Save the updated entity
    const updatedEntity = await this.accountNotificationRepository.save(entity);

    return AccountNotificationMapper.toDomain(updatedEntity);
  }
}
