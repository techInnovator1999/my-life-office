import { ServiceMain } from '../../../../domain/service-main';
import { NullableType } from 'src/utils/types/nullable.type';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { ServiceMainRepository } from '../../service-main.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ServiceMainEntity } from '@/services/infrastructure/persistence/relational/entities/service-main.entity';
import { ServiceMainMapper } from '@/services/infrastructure/persistence/relational/mappers/service-main.mapper';
import { NotFoundException } from '@nestjs/common';
import {
  SortServiceDto,
  FilterMainServiceDto,
} from '@/services/dto/query-service.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';

export class ServiceRelationalRepository implements ServiceMainRepository {
  constructor(
    @InjectRepository(ServiceMainEntity)
    private readonly serviceRepository: Repository<ServiceMainEntity>,
  ) {}

  async create(data: ServiceMain): Promise<ServiceMain> {
    const persistenceModel = ServiceMainMapper.toPersistence(data);
    const entity = await this.serviceRepository.save(
      this.serviceRepository.create(persistenceModel),
    );

    return ServiceMainMapper.toDomain(entity);
  }

  async findManyWithPagination({
    filterOptions,
    id,
    paginationOptions,
  }: {
    filterOptions?: FilterMainServiceDto | null;
    id?: string | null;
    sortOptions?: SortServiceDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<{ total: number; data: ServiceMain[] }> {
    const where: FindOptionsWhere<ServiceMainEntity> = {};
    if (id) {
      where.id = id;
    }

    if (filterOptions) {
      if (filterOptions['name']) {
        where.name = filterOptions.name;
      }
      if (filterOptions['shortName']) {
        where.shortName = filterOptions.shortName;
      }
    }

    const [results, total] = await this.serviceRepository.findAndCount({
      where,
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return {
      total,
      data: results.map((entity) => ServiceMainMapper.toDomain(entity)),
    };
  }

  async findOne(
    fields: EntityCondition<ServiceMain>,
  ): Promise<NullableType<ServiceMain>> {
    const entity = await this.serviceRepository.findOne({
      where: fields as FindOptionsWhere<ServiceMainEntity>,
      relations: {
        carriers: true,
      },
    });

    return entity ? ServiceMainMapper.toDomain(entity) : null;
  }

  async findOneById(id: ServiceMain['id']): Promise<NullableType<ServiceMain>> {
    const entity = await this.serviceRepository.findOne({ where: { id } });
    const domain = entity ? ServiceMainMapper.toDomain(entity) : null;
    return domain;
  }

  async update(
    id: ServiceMain['id'],
    payload: Partial<ServiceMain>,
  ): Promise<ServiceMain | null> {
    const entity = await this.serviceRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException('Service not found.');
    }

    const updatedData = ServiceMainMapper.toPersistence({
      ...ServiceMainMapper.toDomain(entity),
      ...payload,
    });
    // Assign the updated data to the existing entity
    Object.assign(entity, updatedData);

    // Save the updated entity
    const updatedEntity = await this.serviceRepository.save(entity);

    return ServiceMainMapper.toDomain(updatedEntity);
  }

  async softDelete(id: ServiceMain['id']): Promise<void> {
    await this.serviceRepository.softDelete(id);
  }

  async delete(id: ServiceMain['id']): Promise<void> {
    await this.serviceRepository.delete(id);
  }

  async findOrFail(id: ServiceMain['id']): Promise<ServiceMain> {
    const entity = await this.serviceRepository.findOneOrFail({
      where: { id },
    });
    return ServiceMainMapper.toDomain(entity);
  }
}
