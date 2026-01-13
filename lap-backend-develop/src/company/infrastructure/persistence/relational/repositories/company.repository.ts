import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from '@/company/infrastructure/persistence/relational/entities/company.entity';
import { UpdateCompanyDto } from '@/company/dto/update-company.dto';
import { Company } from '@/company/domain/company';
import { CompanyRepository } from '../../company.repository';

@Injectable()
export class CompanyRelationalRepository implements CompanyRepository {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepo: Repository<CompanyEntity>,
  ) {}

  async create(payload: Company): Promise<CompanyEntity> {
    const companyModel = this.companyRepo.create({ name: payload.name });
    return this.companyRepo.save(companyModel);
  }
  async findOrCreateByName(name: string): Promise<CompanyEntity> {
    let company = await this.companyRepo.findOne({ where: { name } });
    if (!company) {
      company = this.companyRepo.create({ name });
      company = await this.companyRepo.save(company);
    }
    return company;
  }

  async findAllWithMasterPaycodes(): Promise<{
    data: CompanyEntity[];
    total: number;
  }> {
    const [entities, total] = await this.companyRepo.findAndCount({
      relations: {
        companyMasterPaycodes: {
          masterPaycode: true,
        },
      },
      // order: {
      //   companyMasterPaycodes: {
      //     masterPaycode: {
      //       serial: 'ASC',
      //     },
      //   },
      // },
    });
    return { data: entities, total };
  }

  async findOneById(id: Company['id']): Promise<CompanyEntity | null> {
    return this.companyRepo.findOne({ where: { id } });
  }

  async remove(id: Company['id']): Promise<void> {
    await this.companyRepo.delete({ id });
  }

  async update(
    id: Company['id'],
    payload: UpdateCompanyDto,
  ): Promise<CompanyEntity> {
    const company = await this.companyRepo.findOneOrFail({
      where: { id },
      relations: ['companyMasterPaycodes'],
    });

    if (payload.name) {
      company.name = payload.name;
    }

    return this.companyRepo.save(company);
  }
}
