import { Paycode } from '@/paycodes/domain/paycode';
import { PaycodeEntity } from '../entities/paycode.entity';
import { refById } from '@/utils/mapping.helper';
import { CarrierEntity } from '@/carriers/infrastructure/persistence/relational/entities/carrier.entity';
import { CarrierMapper } from '@/carriers/infrastructure/persistence/relational/mappers/carrier.mapper';

export class PaycodeMapper {
  static toDomain(entity: PaycodeEntity): Paycode {
    const domain = new Paycode();
    domain.id = entity.id;
    if (entity.carrier) {
      domain.carrier = CarrierMapper.toDomain(entity.carrier);
    }
    domain.name = entity.name;
    domain.type = entity.type;
    domain.createdAt = entity.createdAt;
    domain.updatedAt = entity.updatedAt;
    domain.deletedAt = entity.deletedAt;
    return domain;
  }

  static toPersistence(paycode: Paycode): PaycodeEntity {
    const entity = new PaycodeEntity();
    entity.id = paycode.id;
    entity.name = paycode.name;
    entity.type = paycode.type;
    if (paycode.carrier) {
      entity.carrier = refById<CarrierEntity>(paycode.carrier.id);
    }
    entity.createdAt = paycode.createdAt;
    entity.updatedAt = paycode.updatedAt;
    entity.deletedAt = paycode.deletedAt;
    return entity;
  }
}
