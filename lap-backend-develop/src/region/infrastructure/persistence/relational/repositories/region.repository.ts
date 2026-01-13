import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegionRepository } from '../../region.repository';
import { RegionEntity } from '../entities/region.entity';
import { Region } from '@/region/domain/region';
import { RegionMapper } from '../mappers/region.mapper';
import { QueryRegionDto } from '@/region/dto/query-region.dto';

@Injectable()
export class RegionRelationalRepository implements RegionRepository {
  constructor(
    @InjectRepository(RegionEntity)
    private readonly regionRepository: Repository<RegionEntity>,
  ) {}

  async findAll(query?: QueryRegionDto): Promise<Region[]> {
    const queryBuilder = this.regionRepository.createQueryBuilder('region');

    if (query?.isActive !== undefined) {
      queryBuilder.andWhere('region.isActive = :isActive', { isActive: query.isActive });
    }

    if (query?.search) {
      queryBuilder.andWhere(
        '(region.label ILIKE :search OR region.value ILIKE :search OR region.code ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    queryBuilder.orderBy('region.order', 'ASC')
                 .addOrderBy('region.label', 'ASC');

    const entities = await queryBuilder.getMany();

    return entities.map((entity) => RegionMapper.toDomain(entity));
  }

  async findOne(id: string): Promise<Region | null> {
    const entity = await this.regionRepository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    return RegionMapper.toDomain(entity);
  }
}

