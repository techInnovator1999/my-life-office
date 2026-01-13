import { Module } from '@nestjs/common';
import { DepositTypesService } from './deposit-types.service';
import { DepositTypesController } from './deposit-types.controller';
import { UsersModule } from '@/users/users.module';
import { RelationalPersistenceDepositTypesModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalPersistenceDepositTypesModule, UsersModule],
  controllers: [DepositTypesController],
  providers: [DepositTypesService],
  exports: [DepositTypesService],
})
export class DepositTypesModule {}
