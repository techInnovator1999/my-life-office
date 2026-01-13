import { ServiceSubTypeEntity } from '@/services/infrastructure/persistence/relational/entities/service-sub-type.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubTypeSeedService } from './subType-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceSubTypeEntity])],
  providers: [SubTypeSeedService],
  exports: [SubTypeSeedService],
})
export class SubTypeSeedModule {}
