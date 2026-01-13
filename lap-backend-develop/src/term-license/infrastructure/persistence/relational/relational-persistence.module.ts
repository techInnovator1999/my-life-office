import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TermLicenseEntity } from './entities/term-license.entity';
import { TermLicenseRepository } from '../term-license.repository';
import { TermLicenseRelationalRepository } from './repositories/term-license.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TermLicenseEntity])],
  providers: [
    {
      provide: TermLicenseRepository,
      useClass: TermLicenseRelationalRepository,
    },
  ],
  exports: [TermLicenseRepository],
})
export class TermLicensePersistenceModule {}

