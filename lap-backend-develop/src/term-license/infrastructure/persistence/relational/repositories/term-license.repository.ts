import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TermLicenseRepository } from '../../term-license.repository';
import { TermLicenseEntity } from '../entities/term-license.entity';
import { TermLicense } from '@/term-license/domain/term-license';
import { TermLicenseMapper } from '../mappers/term-license.mapper';
import { QueryTermLicenseDto } from '@/term-license/dto/query-term-license.dto';

@Injectable()
export class TermLicenseRelationalRepository implements TermLicenseRepository {
  constructor(
    @InjectRepository(TermLicenseEntity)
    private readonly termLicenseRepository: Repository<TermLicenseEntity>,
  ) {}

  async findAll(query?: QueryTermLicenseDto): Promise<TermLicense[]> {
    const queryBuilder = this.termLicenseRepository.createQueryBuilder('term_license');

    if (query?.isActive !== undefined) {
      queryBuilder.andWhere('term_license.isActive = :isActive', { isActive: query.isActive });
    }

    if (query?.search) {
      queryBuilder.andWhere(
        '(term_license.label ILIKE :search OR term_license.value ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    queryBuilder.orderBy('term_license.order', 'ASC')
                 .addOrderBy('term_license.label', 'ASC');

    const entities = await queryBuilder.getMany();

    return entities.map((entity) => TermLicenseMapper.toDomain(entity));
  }

  async findOne(id: string): Promise<TermLicense | null> {
    const entity = await this.termLicenseRepository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    return TermLicenseMapper.toDomain(entity);
  }
}

