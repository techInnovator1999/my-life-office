import { Region } from '@/region/domain/region';
import { RegionEntity } from '../entities/region.entity';

export class RegionMapper {
  static toDomain(raw: RegionEntity): Region {
    const domain = new Region();
    domain.id = raw.id;
    domain.label = raw.label;
    domain.value = raw.value;
    domain.code = raw.code;
    domain.order = raw.order;
    domain.isActive = raw.isActive;
    domain.createdAt = raw.createdAt;
    domain.updatedAt = raw.updatedAt;
    domain.deletedAt = raw.deletedAt;
    return domain;
  }

  static toPersistence(domain: Region): RegionEntity {
    const entity = new RegionEntity();
    entity.id = domain.id;
    entity.label = domain.label;
    entity.value = domain.value;
    entity.code = domain.code;
    entity.order = domain.order;
    entity.isActive = domain.isActive;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.deletedAt = domain.deletedAt;
    return entity;
  }
}

