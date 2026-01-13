import { refById } from '@/utils/mapping.helper';
import { MasterPaycodeEntity } from '@/master-paycode/infrastructure/persistence/relational/entities/master-paycode.entity';
import { PaycodeEntity } from '@/paycodes/infrastructure/persistence/relational/entities/paycode.entity';
import { MasterPaycodeMapping } from '@/master-paycode-mapping/domain/master-paycode-mapping';
import { MasterPaycodeMappingEntity } from '../entities/master-paycode-mapping.entity';

export class MasterPaycodeMappingMapper {
  static toDomain(entity: MasterPaycodeMappingEntity): MasterPaycodeMapping {
    const domain = new MasterPaycodeMapping();
    domain.id = entity.id;

    if (entity.masterPaycode) {
      domain.masterPaycode = entity.masterPaycode;
    }
    if (entity.paycode) {
      domain.paycode = entity.paycode;
    }

    domain.createdAt = entity.createdAt;
    domain.updatedAt = entity.updatedAt;
    domain.deletedAt = entity.deletedAt;
    return domain;
  }

  static toPersistance(
    domain: MasterPaycodeMapping,
  ): MasterPaycodeMappingEntity {
    const entity = new MasterPaycodeMappingEntity();
    entity.masterPaycode = refById<MasterPaycodeEntity>(
      domain.masterPaycode.id,
    );
    entity.paycode = refById<PaycodeEntity>(domain.paycode.id);
    return entity;
  }
}
