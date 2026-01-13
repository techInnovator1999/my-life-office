// src/brokers/infrastructure/relational/mappers/broker_staff.mapper.ts

import { BrokerStaffEntity } from '@/brokers/infrastructure/persistence/relational/entities/broker_staff.entity';
import { BrokerStaff } from '@/brokers/domain/broker_staff';
import { BrokerMapper } from './broker.mapper';
import { BrokerEntity } from '@/brokers/infrastructure/persistence/relational/entities/broker.entity';
import { refById } from '@/utils/mapping.helper';

export class BrokerStaffMapper {
  static toDomain(entity: BrokerStaffEntity): BrokerStaff {
    const brokerStaff = new BrokerStaff();
    brokerStaff.id = entity.id;
    brokerStaff.name = entity.name;
    brokerStaff.phone = entity.phone;
    brokerStaff.title = entity.title;
    brokerStaff.email = entity.email;
    brokerStaff.broker = BrokerMapper.toDomain(entity.broker);
    brokerStaff.createdAt = entity.createdAt;
    brokerStaff.updatedAt = entity.updatedAt;
    brokerStaff.deletedAt = entity.deletedAt;
    return brokerStaff;
  }

  static toPersistence(domain: BrokerStaff): BrokerStaffEntity {
    const entity = new BrokerStaffEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.email = domain.email;
    entity.phone = domain.phone;
    entity.title = domain.title;
    if (domain.broker) {
      entity.broker = refById<BrokerEntity>(domain.broker.id);
    }
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.deletedAt = domain.deletedAt;
    return entity;
  }
}
