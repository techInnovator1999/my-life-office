import { Module } from '@nestjs/common';
import { CompanySeedService } from './company-seed.service';
import { CompanyEntity } from '@/company/infrastructure/persistence/relational/entities/company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyMasterPaycodeEntity } from '@/company/infrastructure/persistence/relational/entities/company-master-paycode.entity';
import { MasterPaycodeEntity } from '@/master-paycode/infrastructure/persistence/relational/entities/master-paycode.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CompanyEntity,
      CompanyMasterPaycodeEntity,
      MasterPaycodeEntity,
    ]),
  ],
  providers: [CompanySeedService],
  exports: [CompanySeedService],
})
export class CompanySeedModule {}
