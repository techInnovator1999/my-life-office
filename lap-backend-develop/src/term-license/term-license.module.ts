import { Module } from '@nestjs/common';
import { TermLicenseService } from './term-license.service';
import { TermLicenseController } from './term-license.controller';
import { TermLicensePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [TermLicensePersistenceModule],
  controllers: [TermLicenseController],
  providers: [TermLicenseService],
  exports: [TermLicenseService],
})
export class TermLicenseModule {}

