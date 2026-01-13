import { Module } from '@nestjs/common';
import { CarrierSeedService } from './carrier-seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarrierEntity } from '@/carriers/infrastructure/persistence/relational/entities/carrier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarrierEntity])],
  providers: [CarrierSeedService],
  exports: [CarrierSeedService],
})
export class CarrierSeedModule {}
