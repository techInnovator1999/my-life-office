import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from '@/company/infrastructure/persistence/relational/entities/company.entity';
import { MasterPaycodeEntity } from '@/master-paycode/infrastructure/persistence/relational/entities/master-paycode.entity';
import { CompanyMasterPaycodeEntity } from '@/company/infrastructure/persistence/relational/entities/company-master-paycode.entity';

@Injectable()
export class CompanySeedService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,

    @InjectRepository(CompanyMasterPaycodeEntity)
    private readonly cmlRepository: Repository<CompanyMasterPaycodeEntity>,

    @InjectRepository(MasterPaycodeEntity)
    private readonly mlRepository: Repository<MasterPaycodeEntity>,
  ) {}

  async run(
    companiesSeed: {
      Name: string;
      MasterPaycodes: { Name: string; Value: string; Percentage?: string }[];
    }[],
  ) {
    for (const companySeed of companiesSeed) {
      const company = await this.seedCompany(companySeed);
      console.log(`✅ Processed Company: ${company.name}`);
    }

    return true;
  }

  private async seedCompany(companyData: {
    Name: string;
    MasterPaycodes: { Name: string; Value: string; Percentage?: string }[];
  }) {
    const { Name: companyName, MasterPaycodes: companyMasterPaycodes } =
      companyData;
    let company = await this.companyRepository.findOne({
      where: { name: companyName },
    });

    if (!company) {
      company = this.companyRepository.create({ name: companyName });
      company = await this.companyRepository.save(company);
    }

    for (const level of companyMasterPaycodes) {
      // Get master paycode entity
      const {
        Name: levelName,
        Value: levelValue,
        Percentage: percentage,
      } = level;
      const parsedPercentage =
        percentage && !isNaN(Number(percentage)) ? Number(percentage) : 0;
      let masterPaycode = await this.mlRepository.findOne({
        where: { name: levelName },
      });
      masterPaycode ??= await this.mlRepository.save(
        this.mlRepository.create({
          name: levelName,
          percentage: parsedPercentage,
        }),
      );

      // Check if CompanyMasterPaycode exists
      const exists = await this.cmlRepository.findOne({
        where: {
          company: { id: company.id },
          masterPaycode: { id: masterPaycode.id },
        },
        relations: ['company', 'masterPaycode'],
      });

      if (!exists) {
        const companyMasterPaycode = this.cmlRepository.create({
          company: { id: company.id },
          masterPaycode: { id: masterPaycode.id },
          value: levelValue,
        });
        await this.cmlRepository.save(companyMasterPaycode);
      }
    }

    return company;
  }
}
