import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanSeedService } from './plan-seed.service';
import { PlanEntity } from '@/plan/persistence/relational/entities/plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlanEntity])],
  providers: [PlanSeedService],
  exports: [PlanSeedService],
})
export class PlanSeedModule {}
