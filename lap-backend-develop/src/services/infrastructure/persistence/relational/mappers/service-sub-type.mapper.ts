import { ServiceSubTypeEntity } from '@/services/infrastructure/persistence/relational/entities/service-sub-type.entity';
import { ServiceSubType } from '@/services/domain/service-sub-type';
import { ServiceMainMapper } from './service-main.mapper';
import { ServiceMainEntity } from '@/services/infrastructure/persistence/relational/entities/service-main.entity';
import { ServiceMain } from '@/services/domain/service-main';
import { CreateSubServiceDto } from '@/services/dto/create-sub-service.dto';
import { refById } from '@/utils/mapping.helper';

export class ServiceSubTypeMapper {
  static toDomain(entity: ServiceSubTypeEntity): ServiceSubType {
    const domain = new ServiceSubType();
    domain.id = entity.id;
    domain.name = entity.name;
    domain.description = entity.description;
    if (entity.serviceMain) {
      domain.serviceMain = ServiceMainMapper.toDomain(entity.serviceMain);
    }
    domain.createdAt = entity.createdAt;
    domain.updatedAt = entity.updatedAt;
    domain.deletedAt = entity.deletedAt;

    return domain;
  }

  static toDomainWithCreateDto(dto: CreateSubServiceDto): ServiceSubType {
    const domain = new ServiceSubType();
    domain.name = dto.name;
    domain.description = dto.description;

    if (dto.serviceMainId) {
      const serviceMain = new ServiceMain();
      serviceMain.id = dto.serviceMainId;
      domain.serviceMain = serviceMain;
    }

    return domain;
  }

  static toPersistence(domain: ServiceSubType): ServiceSubTypeEntity {
    const entity = new ServiceSubTypeEntity();
    entity.name = domain.name;
    entity.description = domain.description;

    if (domain.serviceMain) {
      entity.serviceMain = refById<ServiceMainEntity>(domain.serviceMain.id);
    }

    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.deletedAt = domain.deletedAt;
    return entity;
  }
}
