import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LicenseTypeRepository } from '../../license-type.repository';
import { LicenseTypeEntity } from '../entities/license-type.entity';
import { LicenseType } from '@/license-type/domain/license-type';
import { LicenseTypeMapper } from '../mappers/license-type.mapper';
import { QueryLicenseTypeDto } from '@/license-type/dto/query-license-type.dto';

@Injectable()
export class LicenseTypeRelationalRepository implements LicenseTypeRepository {
  constructor(
    @InjectRepository(LicenseTypeEntity)
    private readonly licenseTypeRepository: Repository<LicenseTypeEntity>,
  ) {}

  async findAll(query?: QueryLicenseTypeDto): Promise<LicenseType[]> {
    const queryBuilder = this.licenseTypeRepository.createQueryBuilder('license_type');

    if (query?.isActive !== undefined) {
      queryBuilder.andWhere('license_type.isActive = :isActive', { isActive: query.isActive });
    }

    if (query?.search) {
      queryBuilder.andWhere(
        '(license_type.label ILIKE :search OR license_type.value ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    queryBuilder.orderBy('license_type.order', 'ASC')
                 .addOrderBy('license_type.label', 'ASC');

    const entities = await queryBuilder.getMany();

    return entities.map((entity) => LicenseTypeMapper.toDomain(entity));
  }

  async findOne(id: string): Promise<LicenseType | null> {
    const entity = await this.licenseTypeRepository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    return LicenseTypeMapper.toDomain(entity);
  }
}

