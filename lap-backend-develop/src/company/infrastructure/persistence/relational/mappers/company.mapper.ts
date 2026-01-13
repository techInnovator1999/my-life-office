import { Company } from '@/company/domain/company';
import { CompanyEntity } from '../entities/company.entity';

export class CompanyMapper {
  static toDomain(entity: CompanyEntity): Company {
    const company = new Company();
    company.id = entity.id;
    company.name = entity.name;
    if (entity.companyMasterPaycodes) {
      company.companyMasterPaycodes = entity.companyMasterPaycodes.map(
        (cml) => ({
          id: cml.id,
          masterPaycode: cml.masterPaycode,
          value: cml.value,
        }),
      );
    }
    company.createdAt = entity.createdAt;
    company.updatedAt = entity.updatedAt;
    company.deletedAt = entity.deletedAt;
    return company;
  }
}
