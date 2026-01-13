import { Plan } from '@/plan/domain/plan';
import { PlanEntity } from '../entities/plan.entity';

export class PlanMapper {
  static toDomain(raw: PlanEntity): Plan {
    const plan = new Plan();
    plan.id = raw.id;
    plan.name = raw.name;
    plan.description = raw.description;
    return plan;
  }

  static toUserList(raw: PlanEntity): Plan {
    const plan = new Plan();
    plan.id = raw.id;
    plan.name = raw.name;
    plan.createdAt = raw.createdAt;
    return plan;
  }

  static toPersistence(plan: Plan): PlanEntity {
    const planEntity = new PlanEntity();
    planEntity.name = plan.name;
    planEntity.description = plan.description;
    return planEntity;
  }
}
