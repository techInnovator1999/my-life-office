import { LicenseType } from '@/license-type/domain/license-type';
import { QueryLicenseTypeDto } from '@/license-type/dto/query-license-type.dto';

export abstract class LicenseTypeRepository {
  abstract findAll(query?: QueryLicenseTypeDto): Promise<LicenseType[]>;
  abstract findOne(id: string): Promise<LicenseType | null>;
}

