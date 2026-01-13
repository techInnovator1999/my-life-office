import { Company } from '@/company/domain/company';
import { UpdateCompanyDto } from '@/company/dto/update-company.dto';
import { CompanyEntity } from './relational/entities/company.entity';

export abstract class CompanyRepository {
  abstract create(
    dto: Omit<Company, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<CompanyEntity>;
  abstract findOrCreateByName(name: string): Promise<CompanyEntity>;
  abstract findAllWithMasterPaycodes(): Promise<{
    data: CompanyEntity[];
    total: number;
  }>;
  abstract findOneById(id: Company['id']): Promise<CompanyEntity | null>;
  abstract remove(id: Company['id']): Promise<void>;
  abstract update(
    id: Company['id'],
    payload: UpdateCompanyDto,
  ): Promise<CompanyEntity>;
}
