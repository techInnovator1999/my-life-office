import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarrierRepository } from '../carrier.repository';
import { CarrierEntity } from './entities/carrier.entity';
import { CarrierRelationalRepository } from './repositories/carrier.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CarrierEntity])],
  providers: [
    {
      provide: CarrierRepository,
      useClass: CarrierRelationalRepository,
    },
  ],
  exports: [CarrierRepository],
})
export class RelationalPersistenceCarriersModule {}
