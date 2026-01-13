import { Injectable, NotFoundException } from '@nestjs/common';
import { DepositTypeRepository } from '@/deposit-types/infrastructure/persistence/deposit-type.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { DepositTypeEntity } from '../entities/deposit-type.entity';
import { DepositType } from '@/deposit-types/domain/deposit-type';
import { DepositTypeMapper } from '../mappers/deposit-type.mapper';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FilterDepositTypeDto } from '@/deposit-types/dto/query-deposit-type.dto';

@Injectable()
export class DepositTypeRelationalRepository implements DepositTypeRepository {
  constructor(
    @InjectRepository(DepositTypeEntity)
    private readonly depositTypeRepository: Repository<DepositTypeEntity>,
  ) {}

  async create(data: DepositType): Promise<DepositType> {
    const persistenceModel = DepositTypeMapper.toPersistence(data);
    const newEntity = await this.depositTypeRepository.save(
      this.depositTypeRepository.create(persistenceModel),
    );
    return DepositTypeMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterDepositTypeDto | null;
    paginationOptions: IPaginationOptions;
  }): Promise<{ total: number; data: DepositType[] }> {
    const where: FindOptionsWhere<DepositTypeEntity> = {};
    if (filterOptions) {
      if (filterOptions['serviceMainId']) {
        where.serviceMain = { id: filterOptions.serviceMainId };
      }
    }
    // Retrieve paginated entities
    const [results, total] = await this.depositTypeRepository.findAndCount({
      where,
      relations: {
        serviceMain: true,
      },
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    // Convert entities to domain objects
    const data = results.map((pkg) => DepositTypeMapper.toDomain(pkg));

    return { total, data };
  }

  async remove(id: DepositType['id']): Promise<void> {
    const entity = await this.depositTypeRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException('Deposit type not found');
    }
    await this.depositTypeRepository.remove(entity);
  }

  async findOne(id: DepositType['id']): Promise<DepositType> {
    const entity = await this.depositTypeRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException('Deposit type not found');
    }
    return DepositTypeMapper.toDomain(entity);
  }

  async update(
    id: DepositType['id'],
    data: Partial<DepositType>,
  ): Promise<DepositType> {
    const entity = await this.depositTypeRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException('Deposit type not found');
    }

    // entity.name = data.name;
    // Merge domain data into the existing domain model
    const updatedDomain = DepositTypeMapper.toPersistence({
      ...DepositTypeMapper.toDomain(entity),
      ...data,
    });

    // Assign the updated data to the existing entity
    Object.assign(entity, updatedDomain);

    const updatedEntity = await this.depositTypeRepository.save(entity);

    return DepositTypeMapper.toDomain(updatedEntity);
  }
}
