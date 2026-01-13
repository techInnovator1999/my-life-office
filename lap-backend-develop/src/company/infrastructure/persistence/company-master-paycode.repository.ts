import { CompanyMasterPaycodeEntity } from '@/company/infrastructure/persistence/relational/entities/company-master-paycode.entity';
import { CompanyEntity } from '@/company/infrastructure/persistence/relational/entities/company.entity';
import { CompanyMasterPaycodeInputDto } from '@/company/dto/create-company.dto';

export abstract class CompanymasterPaycodeRepository {
  abstract createManyForCompany(
    company: CompanyEntity,
    levels: CompanyMasterPaycodeInputDto[],
  ): Promise<CompanyMasterPaycodeEntity[]>;
  abstract updateManyForCompany(
    company: CompanyEntity,
    levels: CompanyMasterPaycodeInputDto[],
  ): Promise<CompanyMasterPaycodeEntity[]>;
  abstract deleteByCompanyId(companyId: string): Promise<void>;

  abstract findOneById(id: string): Promise<CompanyMasterPaycodeEntity | null>;

  abstract findByCompanyId(
    companyId: string,
  ): Promise<CompanyMasterPaycodeEntity[]>;
}
