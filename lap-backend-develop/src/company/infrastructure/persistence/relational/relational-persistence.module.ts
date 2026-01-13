import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyRepository } from '../company.repository';
import { CompanymasterPaycodeRepository } from '../company-master-paycode.repository';
import { CompanyMasterPaycodeEntity } from './entities/company-master-paycode.entity';
import { CompanyEntity } from './entities/company.entity';
import { CompanyMasterPaycodeRelationalRepository } from './repositories/company-master-paycode.repository';
import { CompanyRelationalRepository } from './repositories/company.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyEntity, CompanyMasterPaycodeEntity]),
  ],
  providers: [
    {
      provide: CompanyRepository,
      useClass: CompanyRelationalRepository,
    },
    {
      provide: CompanymasterPaycodeRepository,
      useClass: CompanyMasterPaycodeRelationalRepository,
    },
  ],
  exports: [CompanyRepository, CompanymasterPaycodeRepository],
})
export class RelationalCompanyPersistenceModule {}
