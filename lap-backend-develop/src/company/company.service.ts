import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './domain/company';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyRepository } from './infrastructure/persistence/company.repository';
import { CompanyMapper } from './infrastructure/persistence/relational/mappers/company.mapper';
import { CompanymasterPaycodeRepository } from './infrastructure/persistence/company-master-paycode.repository';
import { CompanyMasterPaycode } from './domain/company-master-paycode';

@Injectable()
export class CompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly companymasterPaycodeRepo: CompanymasterPaycodeRepository,
  ) {}

  async create(payload: CreateCompanyDto): Promise<Company> {
    const company = await this.companyRepository.create(payload);
    if (payload.companyMasterPaycodes?.length) {
      await this.companymasterPaycodeRepo.createManyForCompany(
        company,
        payload.companyMasterPaycodes,
      );
    }
    return CompanyMapper.toDomain(company);
  }

  async findAll(): Promise<{ data: Company[]; total: number }> {
    const { data, total } =
      await this.companyRepository.findAllWithMasterPaycodes();
    const companies = data.map((entity) => CompanyMapper.toDomain(entity));
    return { data: companies, total };
  }

  async findOne(id: Company['id']): Promise<Company | null> {
    const entity = await this.companyRepository.findOneById(id);
    if (!entity) {
      throw new NotFoundException(`Company with id ${id} not found`);
    }
    return CompanyMapper.toDomain(entity);
  }

  async update(id: Company['id'], payload: UpdateCompanyDto): Promise<Company> {
    const updatedEntity = await this.companyRepository.update(id, payload);
    if (payload.companyMasterPaycodes?.length) {
      await this.companymasterPaycodeRepo.updateManyForCompany(
        updatedEntity,
        payload.companyMasterPaycodes,
      );
    }
    return CompanyMapper.toDomain(updatedEntity);
  }

  async delete(id: Company['id']): Promise<void> {
    await this.companyRepository.remove(id);
    return this.companymasterPaycodeRepo.deleteByCompanyId(id);
  }

  async getCompanyMasterPaycodes(
    id: Company['id'],
  ): Promise<CompanyMasterPaycode[]> {
    const companyMasterPaycodes =
      await this.companymasterPaycodeRepo.findByCompanyId(id);

    if (!companyMasterPaycodes.length) {
      return [];
    }

    return companyMasterPaycodes;
  }
}
