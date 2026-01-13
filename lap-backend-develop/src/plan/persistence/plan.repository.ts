import { NullableType } from 'src/utils/types/nullable.type';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { DeepPartial } from 'src/utils/types/deep-partial.type';
import { Plan } from '../domain/plan';
import { FilterPlanDto, SortPlanDto } from '../dto/query-plan.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { FindOptionsWhere, UpdateResult } from 'typeorm';

export abstract class PlanRepository {
  abstract create(
    data: Omit<Plan, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Plan>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterPlanDto | null;
    sortOptions?: SortPlanDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<{ total: number; data: Plan[] }>;

  abstract findOne(fields: EntityCondition<Plan>): Promise<NullableType<Plan>>;

  abstract update(
    id: Plan['id'],
    payload: DeepPartial<Plan>,
  ): Promise<Plan | null>;
  abstract updateMany(
    whereParams: FindOptionsWhere<Plan>,
    updateParams: DeepPartial<Plan>,
  ): Promise<UpdateResult>;

  abstract softDelete(id: Plan['id']): Promise<void>;
}
