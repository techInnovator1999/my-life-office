import { ServiceMainEntity } from '@/services/infrastructure/persistence/relational/entities/service-main.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositTypeRepository } from '../deposit-type.repository';
import { DepositTypeEntity } from './entities/deposit-type.entity';
import { DepositTypeRelationalRepository } from './repositories/deposit-type.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DepositTypeEntity, ServiceMainEntity])],
  providers: [
    {
      provide: DepositTypeRepository,
      useClass: DepositTypeRelationalRepository,
    },
  ],
  exports: [DepositTypeRepository],
})
export class RelationalPersistenceDepositTypesModule {}
