import { ServiceMainMapper } from '@/services/infrastructure/persistence/relational/mappers/service-main.mapper';
import { DepositType } from '@/deposit-types/domain/deposit-type';
import { DepositTypeEntity } from '../entities/deposit-type.entity';
import { refById, refObjectsById } from '@/utils/mapping.helper';
import { ServiceMainEntity } from '@/services/infrastructure/persistence/relational/entities/service-main.entity';
import { ProductMapper } from '@/products/infrastructure/persistence/relational/mappers/product.mapper';
import { ProductEntity } from '@/products/infrastructure/persistence/relational/entities/product.entity';
import { DepositTypeNameEntity } from '@/deposit-type-names/infrastructure/persistence/relational/entities/deposit-type-name.entity';

export class DepositTypeMapper {
  static toDomain(entity: DepositTypeEntity): DepositType {
    const domain = new DepositType();
    domain.id = entity.id;
    domain.names = entity.names;
    if (entity.serviceMain) {
      domain.serviceMain = ServiceMainMapper.toDomain(entity.serviceMain);
    }
    if (entity.products) {
      domain.products = entity.products.map((p) => ProductMapper.toDomain(p));
    }
    domain.createdAt = entity.createdAt;
    domain.updatedAt = entity.updatedAt;
    domain.deletedAt = entity.deletedAt;
    return domain;
  }

  static toPersistence(domain: DepositType): DepositTypeEntity {
    const entity = new DepositTypeEntity();
    entity.id = domain.id;
    entity.names = refObjectsById<DepositTypeNameEntity>(domain.names);
    if (domain.serviceMain) {
      entity.serviceMain = refById<ServiceMainEntity>(domain.serviceMain.id);
    }
    entity.products =
      domain.products?.map((p) => refById<ProductEntity>(p.id)) ?? [];
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.deletedAt = domain.deletedAt;
    return entity;
  }
}
