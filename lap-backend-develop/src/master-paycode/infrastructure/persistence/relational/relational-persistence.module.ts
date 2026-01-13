import { CompanyEntity } from '@/company/infrastructure/persistence/relational/entities/company.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterPaycodeRepository } from '../master-paycode.repository';
import { MasterPaycodeEntity } from './entities/master-paycode.entity';
import { MasterPaycodeRepositoryRelationalRepository } from './relational/master-paycode.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MasterPaycodeEntity, CompanyEntity])],
  providers: [
    {
      provide: MasterPaycodeRepository,
      useClass: MasterPaycodeRepositoryRelationalRepository,
    },
  ],
  exports: [MasterPaycodeRepository],
})
export class RelationalMasterPaycodePersistenceModule {}
