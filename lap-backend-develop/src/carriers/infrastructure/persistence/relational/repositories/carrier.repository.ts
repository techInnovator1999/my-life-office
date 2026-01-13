import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { CarrierRepository } from '@/carriers/infrastructure/persistence/carrier.repository';
import { Carrier } from '@/carriers/domain/carrier';
import { CarrierEntity } from '../entities/carrier.entity';
import { CarrierMapper } from '../mappers/carrier.mapper';
import { NullableType } from '@/utils/types/nullable.type';
import {
  FilterCarrierDto,
  SortCarrierDto,
} from '@/carriers/dto/query-carrier.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { FindAllCarrierDto } from '@/carriers/dto/find-all-carrier.dto';

@Injectable()
export class CarrierRelationalRepository implements CarrierRepository {
  constructor(
    @InjectRepository(CarrierEntity)
    private readonly carrierRepo: Repository<CarrierEntity>,
  ) {}

  async create(data: Carrier): Promise<Carrier> {
    const persistenceModel = CarrierMapper.toPersistence(data);
    const entity = this.carrierRepo.create(persistenceModel);
    const newEntity = await this.carrierRepo.save(entity);
    return CarrierMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterCarrierDto | null;
    sortOptions?: SortCarrierDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<{ total: number; data: CarrierEntity[] }> {
    const where: FindOptionsWhere<CarrierEntity> = {};
    if (filterOptions) {
      if (filterOptions['serviceMainId']) {
        where.serviceMain = { id: filterOptions.serviceMainId };
      }

      if (filterOptions['productId']) {
        where.products = { id: filterOptions.productId };
      }
    }

    const order: Record<string, 'ASC' | 'DESC'> = {};
    if (sortOptions && sortOptions.length > 0) {
      sortOptions.forEach((s) => {
        if (s.orderBy) {
          order[s.orderBy] = s.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        }
      });
    }
    // Count total records
    const [entities, total] = await this.carrierRepo.findAndCount({
      where,
      relations: ['paycodes'],
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      order,
    });

    return { total, data: entities };
  }

  async findMany(
    fields: EntityCondition<Carrier>,
  ): Promise<FindAllCarrierDto[]> {
    const entity = await this.carrierRepo.find({
      where: fields as FindOptionsWhere<CarrierEntity>,
    });

    return entity.map((pkg) => CarrierMapper.toDomainMany(pkg));
  }

  async findOne(
    fields: EntityCondition<Carrier>,
  ): Promise<NullableType<CarrierEntity>> {
    const entity = await this.carrierRepo.findOne({
      where: fields as FindOptionsWhere<CarrierEntity>,
      relations: ['products', 'paycodes', 'serviceMain', 'broker'],
      // loadEagerRelations: true,
    });
    return entity ?? null;
  }

  async findOneById(id: Carrier['id']): Promise<NullableType<CarrierEntity>> {
    const entity = await this.carrierRepo.findOne({
      where: { id },
      // loadEagerRelations: true,
      relations: ['products', 'paycodes', 'serviceMain', 'broker'],
    });

    return entity ?? null;
  }

  async update(id: Carrier['id'], payload: Partial<Carrier>): Promise<Carrier> {
    const entity = await this.carrierRepo.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException('Carrier not found');
    }

    const domain = CarrierMapper.toDomain(entity);
    const updatedDomain = { ...domain, ...payload };
    const updatedData = CarrierMapper.toPersistence(updatedDomain);
    // Assign the updated data to the existing entity
    Object.assign(entity, updatedData);

    // Save the updated entity
    const updatedEntity = await this.carrierRepo.save(entity);

    return CarrierMapper.toDomain(updatedEntity);
  }

  async softDelete(id: Carrier['id']): Promise<void> {
    await this.carrierRepo.softDelete(id);
  }

  async delete(id: Carrier['id']): Promise<void> {
    await this.carrierRepo.delete(id);
  }

  findOrFail(id: Carrier['id']): Promise<Carrier> {
    return this.carrierRepo.findOne({ where: { id } }).then((entity) => {
      if (!entity) {
        throw new Error('Carrier not found');
      }
      return CarrierMapper.toDomain(entity);
    });
  }
}
