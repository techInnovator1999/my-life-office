import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AccountManagerEntity } from './entities/account-manager.entity';
import { AccountManagerRepository } from '../account-manager.repository';
import { AccountManagerRelationalRepository } from './repositories/account-manager.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AccountManagerEntity])],
  providers: [
    {
      provide: AccountManagerRepository,
      useClass: AccountManagerRelationalRepository,
    },
  ],
  exports: [AccountManagerRepository],
})
export class RelationalAccountManagerPersistenceModule {}
