import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyMasterPaycodeEntity } from '@/company/infrastructure/persistence/relational/entities/company-master-paycode.entity';
import { CompanyEntity } from '@/company/infrastructure/persistence/relational/entities/company.entity';
import { CompanymasterPaycodeRepository } from '../../company-master-paycode.repository';
import { CompanyMasterPaycodeInputDto } from '@/company/dto/create-company.dto';

@Injectable()
export class CompanyMasterPaycodeRelationalRepository extends CompanymasterPaycodeRepository {
  constructor(
    @InjectRepository(CompanyMasterPaycodeEntity)
    private readonly repo: Repository<CompanyMasterPaycodeEntity>,
  ) {
    super();
  }

  async createManyForCompany(
    company: CompanyEntity,
    levels: CompanyMasterPaycodeInputDto[],
  ): Promise<CompanyMasterPaycodeEntity[]> {
    const entities = levels.map((ml) => {
      const cml = new CompanyMasterPaycodeEntity();
      cml.masterPaycode = { id: ml.id } as any;
      cml.value = ml.value ?? '';
      cml.company = company;
      return cml;
    });

    return this.repo.save(entities);
  }

  async updateManyForCompany(
    company: CompanyEntity,
    levels: CompanyMasterPaycodeEntity[],
  ): Promise<CompanyMasterPaycodeEntity[]> {
    for (const updateLevel of levels) {
      const target = company.companyMasterPaycodes.find(
        (cml) => cml.masterPaycode.id === updateLevel.id,
      );

      if (target) {
        target.value = updateLevel.value ?? '';
      } else {
        throw new NotFoundException(
          `Master Paycode ID ${updateLevel.id} does not exist in company`,
        );
      }
    }

    return this.repo.save(company.companyMasterPaycodes);
  }

  async deleteByCompanyId(companyId: string): Promise<void> {
    await this.repo.delete({ company: { id: companyId } });
  }

  async findOneById(id: string): Promise<CompanyMasterPaycodeEntity | null> {
    return this.repo.findOneBy({ id });
  }

  async findByCompanyId(
    companyId: string,
  ): Promise<CompanyMasterPaycodeEntity[]> {
    return this.repo.find({
      where: { company: { id: companyId } },
      relations: ['masterPaycode'],
    });
  }
}
