import { MasterPaycodeEntity } from '@/master-paycode/infrastructure/persistence/relational/entities/master-paycode.entity';
import { MasterPaycode } from '@/master-paycode/domain/master-paycode';

export class MasterPaycodeMapper {
  static toDomain(entity: MasterPaycodeEntity): MasterPaycode {
    const domain = new MasterPaycode();
    domain.id = entity.id;
    domain.name = entity.name;
    domain.serial = entity.serial;
    domain.createdAt = entity.createdAt;
    domain.updatedAt = entity.updatedAt;
    domain.deletedAt = entity.deletedAt;
    return domain;
  }

  static toPersistence(domain: MasterPaycode): MasterPaycodeEntity {
    const entity = new MasterPaycodeEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    if (domain.serial) {
      entity.serial = domain.serial;
    }
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.deletedAt = domain.deletedAt;
    return entity;
  }
}
