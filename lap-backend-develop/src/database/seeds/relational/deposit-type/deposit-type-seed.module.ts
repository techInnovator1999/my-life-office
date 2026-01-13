import { DepositTypeNameEntity } from '@/deposit-type-names/infrastructure/persistence/relational/entities/deposit-type-name.entity';
import { DepositTypeEntity } from '@/deposit-types/infrastructure/persistence/relational/entities/deposit-type.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositTypeSeedService } from './deposit-type-seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DepositTypeEntity, DepositTypeNameEntity]),
  ],
  providers: [DepositTypeSeedService],
  exports: [DepositTypeSeedService],
})
export class DepositTypeSeedModule {}
