import { Injectable } from '@nestjs/common';
import { TermLicense } from './domain/term-license';
import { TermLicenseRepository } from './infrastructure/persistence/term-license.repository';
import { QueryTermLicenseDto } from './dto/query-term-license.dto';

@Injectable()
export class TermLicenseService {
  constructor(
    private readonly termLicenseRepository: TermLicenseRepository,
  ) {}

  async findAll(query?: QueryTermLicenseDto): Promise<TermLicense[]> {
    return this.termLicenseRepository.findAll(query);
  }

  async findOne(id: string): Promise<TermLicense | null> {
    return this.termLicenseRepository.findOne(id);
  }
}

