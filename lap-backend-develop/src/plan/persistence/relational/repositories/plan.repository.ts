import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { FindOptionsWhere, In, Repository, UpdateResult } from 'typeorm';
import { NullableType } from '@/utils/types/nullable.type';
import { PlanEntity } from '../entities/plan.entity';
import { PlanMapper } from '../mappers/plan.mapper';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { PlanRepository } from '../../plan.repository';
import { Plan } from '@/plan/domain/plan';
import { FilterPlanDto, SortPlanDto } from '@/plan/dto/query-plan.dto';

@Injectable()
export class PlanRelationalRepository implements PlanRepository {
  constructor(
    @InjectRepository(PlanEntity)
    private readonly planRepository: Repository<PlanEntity>,
  ) {}

  async create(data: Plan): Promise<Plan> {
    const persistenceModel = PlanMapper.toPersistence(data);
    await this.planRepository.save(
      this.planRepository.create(persistenceModel),
    );
    return data;
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterPlanDto | null;
    sortOptions?: SortPlanDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<{ total: number; data: Plan[] }> {
    const where: FindOptionsWhere<PlanEntity> = {};
    if (filterOptions?.name) {
      where.name = In(filterOptions.name);
    }

    // Count total records
    const total = await this.planRepository.count({ where });

    // Retrieve paginated entities
    const entities = await this.planRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    // Convert entities to domain objects
    const data = entities.map((pkg) => PlanMapper.toDomain(pkg));

    return { total, data };
  }

  async findOne(fields: EntityCondition<Plan>): Promise<NullableType<Plan>> {
    const entity = await this.planRepository.findOne({
      where: fields as FindOptionsWhere<PlanEntity>,
    });

    return entity ? PlanMapper.toDomain(entity) : null;
  }

  async update(id: Plan['id'], payload: Partial<Plan>): Promise<Plan> {
    const entity = await this.planRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('User not found');
    }

    const updatedData = PlanMapper.toPersistence({
      ...PlanMapper.toDomain(entity),
      ...payload,
    });

    // Assign the updated data to the existing entity
    Object.assign(entity, updatedData);

    // Save the updated entity
    const updatedEntity = await this.planRepository.save(entity);
    console.log('=====>updatedEntity', updatedEntity);
    return updatedData;
  }

  async updateMany(
    whereParams: FindOptionsWhere<Plan>,
    updateParams: Partial<Plan>,
  ): Promise<UpdateResult> {
    return await this.planRepository.update(whereParams, updateParams);
  }

  async softDelete(id: Plan['id']): Promise<void> {
    await this.planRepository.softDelete(id);
  }
}
