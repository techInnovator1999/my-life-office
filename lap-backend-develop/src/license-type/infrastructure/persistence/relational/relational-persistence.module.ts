import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LicenseTypeEntity } from './entities/license-type.entity';
import { LicenseTypeRepository } from '../license-type.repository';
import { LicenseTypeRelationalRepository } from './repositories/license-type.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LicenseTypeEntity])],
  providers: [
    {
      provide: LicenseTypeRepository,
      useClass: LicenseTypeRelationalRepository,
    },
  ],
  exports: [LicenseTypeRepository],
})
export class LicenseTypePersistenceModule {}

