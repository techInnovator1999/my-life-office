import { LicenseType } from '@/license-type/domain/license-type';
import { LicenseTypeEntity } from '../entities/license-type.entity';

export class LicenseTypeMapper {
  static toDomain(raw: LicenseTypeEntity): LicenseType {
    const domain = new LicenseType();
    domain.id = raw.id;
    domain.label = raw.label;
    domain.value = raw.value;
    domain.order = raw.order;
    domain.isActive = raw.isActive;
    domain.createdAt = raw.createdAt;
    domain.updatedAt = raw.updatedAt;
    domain.deletedAt = raw.deletedAt;
    return domain;
  }

  static toPersistence(domain: LicenseType): LicenseTypeEntity {
    const entity = new LicenseTypeEntity();
    entity.id = domain.id;
    entity.label = domain.label;
    entity.value = domain.value;
    entity.order = domain.order;
    entity.isActive = domain.isActive;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.deletedAt = domain.deletedAt;
    return entity;
  }
}

