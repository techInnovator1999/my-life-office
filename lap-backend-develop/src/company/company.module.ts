import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { UsersModule } from '@/users/users.module';
import { CompanyService } from './company.service';
import { RelationalCompanyPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalCompanyPersistenceModule, UsersModule],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [RelationalCompanyPersistenceModule, CompanyService],
})
export class CompanyModule {}
