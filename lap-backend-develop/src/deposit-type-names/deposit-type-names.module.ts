import { Module } from '@nestjs/common';
import { DepositTypeNamesService } from './deposit-type-names.service';
import { DepositTypeNamesController } from './deposit-type-names.controller';
import { UsersModule } from '@/users/users.module';
import { RelationalPersistnceDepositTypeNamesModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalPersistnceDepositTypeNamesModule, UsersModule],
  controllers: [DepositTypeNamesController],
  providers: [DepositTypeNamesService],
})
export class DepositTypeNamesModule {}
