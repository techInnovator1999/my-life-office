import { ServiceMainEntity } from '../entities/service-main.entity';
import { ServiceMain } from '@/services/domain/service-main';
import { CarrierEntity } from '@/carriers/infrastructure/persistence/relational/entities/carrier.entity';
import { ServiceSubTypeEntity } from '../entities/service-sub-type.entity';
import { DepositTypeEntity } from '@/deposit-types/infrastructure/persistence/relational/entities/deposit-type.entity';
import { ServiceSubTypeMapper } from './service-sub-type.mapper';
import { DepositTypeMapper } from '@/deposit-types/infrastructure/persistence/relational/mappers/deposit-type.mapper';
import { CarrierMapper } from '@/carriers/infrastructure/persistence/relational/mappers/carrier.mapper';
import { refById } from '@/utils/mapping.helper';

export class ServiceMainMapper {
  static toDomain(entity: ServiceMainEntity): ServiceMain {
    const domain = new ServiceMain();
    domain.id = entity.id;
    domain.name = entity.name;
    domain.shortName = entity.shortName;
    domain.description = entity.description;
    domain.serviceSubTypes =
      entity.serviceSubTypes?.map((subType) =>
        ServiceSubTypeMapper.toDomain(subType),
      ) ?? [];
    domain.depositTypes =
      entity.depositTypes?.map((dt) => DepositTypeMapper.toDomain(dt)) ?? [];

    domain.carriers =
      entity.carriers?.map((carrier) => CarrierMapper.toDomain(carrier)) ?? [];
    domain.createdAt = entity.createdAt;
    domain.updatedAt = entity.updatedAt;
    domain.deletedAt = entity.deletedAt;

    return domain;
  }

  static toPersistence(domain: ServiceMain): ServiceMainEntity {
    const entity = new ServiceMainEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.shortName = domain.shortName;
    entity.description = domain.description;
    if (domain.carriers?.length) {
      entity.carriers = domain.carriers.map((carrier) => {
        const carrierEntity = new CarrierEntity();
        carrierEntity.id = carrier.id;
        return carrierEntity;
      });
    }

    if (domain.serviceSubTypes?.length) {
      entity.serviceSubTypes = domain.serviceSubTypes.map((st) => {
        const subtypeEntity = new ServiceSubTypeEntity();
        subtypeEntity.id = st.id;
        subtypeEntity.serviceMain = refById<ServiceMainEntity>(domain.id);
        return subtypeEntity;
      });
    }

    if (domain.depositTypes?.length) {
      entity.depositTypes = domain.depositTypes.map((dt) => {
        const depositTypeEntity = new DepositTypeEntity();
        depositTypeEntity.id = dt.id;
        return depositTypeEntity;
      });
    }

    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.deletedAt = domain.deletedAt;

    return entity;
  }
}
