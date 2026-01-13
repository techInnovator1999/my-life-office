import { TermLicense } from '@/term-license/domain/term-license';
import { TermLicenseEntity } from '../entities/term-license.entity';

export class TermLicenseMapper {
  static toDomain(raw: TermLicenseEntity): TermLicense {
    const domain = new TermLicense();
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

  static toPersistence(domain: TermLicense): TermLicenseEntity {
    const entity = new TermLicenseEntity();
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

