import { ServiceSubType } from '../../../../domain/service-sub-type';
import { NullableType } from 'src/utils/types/nullable.type';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { SericeSubtypeRepository } from '../../service-sub-type.repository';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ServiceSubTypeEntity } from '@/services/infrastructure/persistence/relational/entities/service-sub-type.entity';
import { ServiceSubTypeMapper } from '@/services/infrastructure/persistence/relational/mappers/service-sub-type.mapper';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateSubServiceDto } from '@/services/dto/update-service.dto';
import { ServiceMainEntity } from '../entities/service-main.entity';

export class ServiceSubRelationalRepository implements SericeSubtypeRepository {
  constructor(
    @InjectRepository(ServiceSubTypeEntity)
    private readonly serviceRepository: Repository<ServiceSubTypeEntity>,
  ) {}

  async create(data: ServiceSubType): Promise<ServiceSubType> {
    // const subtypeDomainModel = ServiceSubTypeMapper.toDomainWithCreateDto(data);
    const persistenceModel = ServiceSubTypeMapper.toPersistence(data);
    const entity = await this.serviceRepository.save(
      this.serviceRepository.create(persistenceModel),
    );

    return ServiceSubTypeMapper.toDomain(entity);
  }

  async findManyWithPagination({
    mainServiceId,
    paginationOptions,
  }: {
    mainServiceId?: string | null;
    id?: string | null;
    sortOptions?: Record<string, string> | null;
    paginationOptions: {
      page: number;
      limit: number;
    };
  }): Promise<{ total: number; data: ServiceSubType[] }> {
    const where: FindOptionsWhere<ServiceSubTypeEntity> = {};
    if (mainServiceId) {
      where.serviceMain = { id: mainServiceId };
    }
    const [results, total] = await this.serviceRepository.findAndCount({
      where,
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      relations: {
        serviceMain: true,
      },
    });

    return {
      total,
      data: results.map((entity) => ServiceSubTypeMapper.toDomain(entity)),
    };
  }

  async findOne(
    fields: EntityCondition<ServiceSubType>,
  ): Promise<NullableType<ServiceSubType>> {
    const entity = await this.serviceRepository.findOne({
      where: fields as FindOptionsWhere<ServiceSubTypeEntity>,
      relations: {
        serviceMain: true,
      },
    });

    return entity ? ServiceSubTypeMapper.toDomain(entity) : null;
  }

  async findOneById(
    id: ServiceSubType['id'],
  ): Promise<NullableType<ServiceSubType>> {
    const entity = await this.serviceRepository.findOne({ where: { id } });
    const domain = entity ? ServiceSubTypeMapper.toDomain(entity) : null;
    return domain;
  }

  async update(
    id: ServiceSubType['id'],
    // payload: Partial<ServiceSubTypeEntity>,
    payload: UpdateSubServiceDto,
  ): Promise<ServiceSubType | null> {
    const entity = await this.serviceRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException('Service not found.');
    }

    const updatedData = ServiceSubTypeMapper.toPersistence({
      ...ServiceSubTypeMapper.toDomain(entity),
      ...payload,
    });

    // Assign the updated data to the existing entity
    // Object.assign(entity, updatedData);
    // Assing properties individually so that we can also map relationship correctly
    entity.name = updatedData.name;
    entity.description = updatedData.description;
    if (payload.serviceMainId) {
      entity.serviceMain = { id: payload.serviceMainId } as ServiceMainEntity;
    }
    // Save the updated entity
    const updatedEntity = await this.serviceRepository.save(entity);

    return ServiceSubTypeMapper.toDomain(updatedEntity);
  }

  async softDelete(id: ServiceSubType['id']): Promise<void> {
    await this.serviceRepository.softDelete(id);
  }

  async delete(id: ServiceSubType['id']): Promise<void> {
    await this.serviceRepository.delete(id);
  }

  async findOrFail(id: ServiceSubType['id']): Promise<ServiceSubType> {
    const entity = await this.serviceRepository.findOneOrFail({
      where: { id },
      relations: {
        serviceMain: true,
      },
    });

    if (!entity) {
      throw new NotFoundException('Service not found.');
    }
    return ServiceSubTypeMapper.toDomain(entity);
  }
}
