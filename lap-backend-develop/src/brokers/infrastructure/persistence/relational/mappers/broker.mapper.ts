import { Broker } from '@/brokers/domain/broker';
import { BrokerEntity } from '@/brokers/infrastructure/persistence/relational/entities/broker.entity';
import { CarrierMapper } from '@/carriers/infrastructure/persistence/relational/mappers/carrier.mapper';
import { BrokerStaffMapper } from './broker_staff.mapper';
import { refManyByIds } from '@/utils/mapping.helper';
import { CarrierEntity } from '@/carriers/infrastructure/persistence/relational/entities/carrier.entity';
import { BrokerStaffEntity } from '@/brokers/infrastructure/persistence/relational/entities/broker_staff.entity';
export class BrokerMapper {
  static toDomain(entity: BrokerEntity): Broker {
    const broker = new Broker();
    broker.id = entity.id;
    broker.name = entity.name;
    broker.brokerType = entity.brokerType;
    broker.website = entity.website ?? null;
    broker.address = entity.address ?? null;
    broker.contracting = entity.contracting ?? null;
    broker.mainContact = entity.mainContact ?? null;
    broker.phoneNumber = entity.phoneNumber ?? null;
    broker.notes = entity.notes ?? null;
    if (entity.carriers?.length) {
      broker.carriers =
        entity.carriers?.map((c) => CarrierMapper.toDomain(c)) ?? [];
    }
    if (entity.brokerStaff?.length) {
      broker.brokerStaff =
        entity.brokerStaff?.map((s) => BrokerStaffMapper.toDomain(s)) ?? [];
    }
    broker.createdAt = entity.createdAt;
    broker.updatedAt = entity.updatedAt;
    broker.deletedAt = entity.deletedAt;

    return broker;
  }

  static toPersistence(domain: Broker): BrokerEntity {
    const entity = new BrokerEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.brokerType = domain.brokerType;
    entity.website = domain.website ?? null;
    entity.address = domain.address ?? null;
    entity.contracting = domain.contracting ?? null;
    entity.mainContact = domain.mainContact ?? null;
    entity.phoneNumber = domain.phoneNumber ?? null;
    entity.notes = domain.notes ?? null;
    if (domain.carriers?.length) {
      entity.carriers = refManyByIds<CarrierEntity>(
        domain.carriers.map((carrier) => carrier.id),
      );
    }
    if (domain.brokerStaff?.length) {
      entity.brokerStaff = refManyByIds<BrokerStaffEntity>(
        domain.brokerStaff.map((brokerStaff) => brokerStaff.id),
      );
    }
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.deletedAt = domain.deletedAt;

    return entity;
  }
}
