import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { UsersModule } from '@/users/users.module';
import { RelationalServicesPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { SubService } from './subService.service';
import { MainService } from './services.service';

@Module({
  imports: [RelationalServicesPersistenceModule, UsersModule],
  controllers: [ServicesController],
  providers: [MainService, SubService],
  exports: [RelationalServicesPersistenceModule, MainService, SubService],
})
export class ServicesModule {}
