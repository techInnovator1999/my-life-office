import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { NullableType } from '@/utils/types/nullable.type';
import { EntityCondition } from '@/utils/types/entity-condition.type';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { AccountManagerRepository } from '../../account-manager.repository';
import { AccountManagerEntity } from '../entities/account-manager.entity';
import { AccountManagerMapper } from '../mappers/account-manager.mapper';
import { SortAccountManagerDto } from '@/account-manager/dto/query-account-manager.dto';
import { AccountManager } from '@/account-manager/domain/account-manager';
import { RoleEnum } from '@/roles/roles.enum';

@Injectable()
export class AccountManagerRelationalRepository
  implements AccountManagerRepository
{
  constructor(
    @InjectRepository(AccountManagerEntity)
    private readonly accountManagerRepository: Repository<AccountManagerEntity>,
  ) {}

  async create(data: AccountManager): Promise<AccountManager> {
    const persistenceModel = AccountManagerMapper.toPersistence(data);
    const newEntity = await this.accountManagerRepository.save(
      this.accountManagerRepository.create(persistenceModel),
    );
    return AccountManagerMapper.toDomain(newEntity);
  }

  async findByUserId(userId: string): Promise<NullableType<AccountManager>> {
    const where: FindOptionsWhere<AccountManagerEntity> = {};
    where.user = { id: userId };
    const entity = await this.accountManagerRepository.findOne({
      where: where,
    });

    return entity ? AccountManagerMapper.toDomain(entity) : null;
  }

  async update(
    id: AccountManager['id'],
    payload: Partial<AccountManager>,
  ): Promise<AccountManager> {
    const entity = await this.accountManagerRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('User not found');
    }

    const updatedData = AccountManagerMapper.toPersistence({
      ...AccountManagerMapper.toDomain(entity),
      ...payload,
    });

    // Assign the updated data to the existing entity
    Object.assign(entity, updatedData);

    // Save the updated entity
    await this.accountManagerRepository.save(entity);

    return updatedData;
  }

  async findOne(
    fields: EntityCondition<AccountManager>,
  ): Promise<NullableType<AccountManager>> {
    const entity = await this.accountManagerRepository.findOne({
      where: fields as FindOptionsWhere<AccountManagerEntity>,
      relations: {
        user: {
          role: true,
          status: true,
        },
      },
    });

    return entity ? AccountManagerMapper.toDomain(entity) : null;
  }

  async findManyWithPagination({
    status,
    sortOptions,
    paginationOptions,
  }: {
    status?: string;
    filterOptions?: Record<string, string> | null;
    sortOptions?: SortAccountManagerDto[] | null;
    paginationOptions: IPaginationOptions;
  }) {
    const where: FindOptionsWhere<AccountManagerEntity> = {};
    where.user = { role: { id: RoleEnum.ACCOUNT_MANAGER } };

    if (status) {
      where.user = {
        accountManagerStatus: status,
      };
    }
    // Count total records
    const total = await this.accountManagerRepository.count({ where });
    const entities = await this.accountManagerRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      relations: {
        user: true,
      },
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    // Convert entities to domain objects
    const data = entities.map((user) =>
      AccountManagerMapper.toDomainMany(user),
    );
    return { total, data };
  }
}
