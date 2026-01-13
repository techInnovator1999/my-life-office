import { Module } from '@nestjs/common';
import { LicenseTypeService } from './license-type.service';
import { LicenseTypeController } from './license-type.controller';
import { LicenseTypePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [LicenseTypePersistenceModule],
  controllers: [LicenseTypeController],
  providers: [LicenseTypeService],
  exports: [LicenseTypeService],
})
export class LicenseTypeModule {}

