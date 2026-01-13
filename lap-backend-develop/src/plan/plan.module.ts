import { Module } from '@nestjs/common';
import { RelationalPlanPersistenceModule } from './persistence/relational/relational-persistence.module';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [RelationalPlanPersistenceModule, UsersModule],
  controllers: [PlanController],
  providers: [PlanService],
  exports: [PlanService, RelationalPlanPersistenceModule],
})
export class PlanModule {}
