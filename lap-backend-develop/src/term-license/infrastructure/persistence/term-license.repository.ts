import { TermLicense } from '@/term-license/domain/term-license';
import { QueryTermLicenseDto } from '@/term-license/dto/query-term-license.dto';

export abstract class TermLicenseRepository {
  abstract findAll(query?: QueryTermLicenseDto): Promise<TermLicense[]>;
  abstract findOne(id: string): Promise<TermLicense | null>;
}

