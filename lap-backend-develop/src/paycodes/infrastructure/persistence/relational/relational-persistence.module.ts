import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarrierEntity } from '@/carriers/infrastructure/persistence/relational/entities/carrier.entity';
import { PaycodeEntity } from './entities/paycode.entity';
import { PaycodeRepository } from '../paycode.repository';
import { PaycodeRelationalRepository } from './relational/paycode.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PaycodeEntity, CarrierEntity])],
  providers: [
    {
      provide: PaycodeRepository,
      useClass: PaycodeRelationalRepository,
    },
  ],
  exports: [PaycodeRepository],
})
export class RelationalPaycodesPersistenceModule {}
