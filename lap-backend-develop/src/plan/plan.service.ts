import { Injectable } from '@nestjs/common';
import { PlanRepository } from './persistence/plan.repository';
import { CreatePlanDto } from './dto/create-plan.dto';
import { Plan } from './domain/plan';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { EntityCondition } from '@/utils/types/entity-condition.type';
import { NullableType } from '@/utils/types/nullable.type';
import { FilterPlanDto, SortPlanDto } from './dto/query-plan.dto';
import { DeepPartial } from '@/utils/types/deep-partial.type';

@Injectable()
export class PlanService {
  constructor(private readonly planRepository: PlanRepository) {}

  async create(createPacakgeDto: CreatePlanDto): Promise<Plan> {
    const newPlan = await this.planRepository.create(createPacakgeDto);
    return newPlan;
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
    return await this.planRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  async findOne(fields: EntityCondition<Plan>): Promise<NullableType<Plan>> {
    return await this.planRepository.findOne(fields);
  }

  async update(
    id: Plan['id'],
    payload: DeepPartial<Plan>,
  ): Promise<Plan | null> {
    const updatedPlan = await this.planRepository.update(id, payload);
    return updatedPlan;
  }

  async softDelete(id: Plan['id']): Promise<void> {
    await this.planRepository.softDelete(id);
  }
}
