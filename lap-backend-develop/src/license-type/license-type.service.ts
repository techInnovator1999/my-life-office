import { Injectable } from '@nestjs/common';
import { LicenseType } from './domain/license-type';
import { LicenseTypeRepository } from './infrastructure/persistence/license-type.repository';
import { QueryLicenseTypeDto } from './dto/query-license-type.dto';

@Injectable()
export class LicenseTypeService {
  constructor(
    private readonly licenseTypeRepository: LicenseTypeRepository,
  ) {}

  async findAll(query?: QueryLicenseTypeDto): Promise<LicenseType[]> {
    return this.licenseTypeRepository.findAll(query);
  }

  async findOne(id: string): Promise<LicenseType | null> {
    return this.licenseTypeRepository.findOne(id);
  }
}

