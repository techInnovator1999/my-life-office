import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositTypeNameRepository } from '../deposit-type-name.repository';
import { DepositTypeNameEntity } from './entities/deposit-type-name.entity';
import { DepositTypeNameRelationalRepository } from './repositories/deposit-type-name.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DepositTypeNameEntity])],
  providers: [
    {
      provide: DepositTypeNameRepository,
      useClass: DepositTypeNameRelationalRepository,
    },
  ],
  exports: [DepositTypeNameRepository],
})
export class RelationalPersistnceDepositTypeNamesModule {}
