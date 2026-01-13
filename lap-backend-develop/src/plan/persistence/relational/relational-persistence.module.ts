import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntity } from './entities/plan.entity';
import { PlanRelationalRepository } from './repositories/plan.repository';
import { PlanRepository } from '../plan.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PlanEntity])],
  providers: [
    {
      provide: PlanRepository,
      useClass: PlanRelationalRepository,
    },
  ],
  exports: [PlanRepository],
})
export class RelationalPlanPersistenceModule {}
