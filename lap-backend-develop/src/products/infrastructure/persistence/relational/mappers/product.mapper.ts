import { Product } from '../../../../domain/product';
import { ProductEntity } from '../entities/product.entity';
import { CarrierMapper } from '@/carriers/infrastructure/persistence/relational/mappers/carrier.mapper';
import { ServiceSubTypeMapper } from '@/services/infrastructure/persistence/relational/mappers/service-sub-type.mapper';
import { DepositTypeMapper } from '@/deposit-types/infrastructure/persistence/relational/mappers/deposit-type.mapper';
import { refById } from '@/utils/mapping.helper';
import { DepositTypeEntity } from '@/deposit-types/infrastructure/persistence/relational/entities/deposit-type.entity';
import { ServiceSubTypeEntity } from '@/services/infrastructure/persistence/relational/entities/service-sub-type.entity';
import { ProductCommissionMapper } from '@/product-commissions/infrastructure/persistence/relational/mappers/product-commission.mapper';

export class ProductMapper {
  static toDomain(entity: ProductEntity): Product {
    const domain = new Product();
    domain.id = entity.id;
    domain.name = entity.name;
    domain.carrier = CarrierMapper.toDomain(entity.carrier);
    domain.serviceSubType = ServiceSubTypeMapper.toDomain(
      entity.serviceSubType,
    );
    domain.depositType = DepositTypeMapper.toDomain(entity.depositType);
    domain.productCommissions =
      entity.productCommissions?.map((pc) =>
        ProductCommissionMapper.toDomain(pc),
      ) ?? [];
    domain.stateAvailable = entity.stateAvailable;
    domain.subName = entity.subName;
    domain.productFullName = entity.productFullName;
    domain.lengths = entity.lengths;
    domain.serviceMainType = entity.serviceMainType;
    domain.productReal = entity.productReal;
    domain.tier = entity.tier;
    domain.rating = entity.rating;
    domain.orderNo = entity.orderNo;
    domain.criteria = entity.criteria;
    domain.notes = entity.notes;
    domain.createdAt = entity.createdAt;
    domain.updatedAt = entity.updatedAt;
    domain.deletedAt = entity.deletedAt;
    return domain;
  }

  static toPersistence(product: Product): ProductEntity {
    const entity = new ProductEntity();
    entity.id = product.id;
    entity.name = product.name;
    entity.carrier = CarrierMapper.toPersistence(product.carrier);
    if (product.serviceSubType) {
      entity.serviceSubType = refById<ServiceSubTypeEntity>(
        product.serviceSubType.id,
      );
    }
    if (product.depositType) {
      entity.depositType = refById<DepositTypeEntity>(product.depositType.id);
    }
    // if (product.productCommissions) {
    //   entity.productCommissions = refManyByIds<ProductCommissionEntity>(
    //     product.productCommissions.map((pc) => pc.id),
    //   );
    // }
    entity.stateAvailable = product.stateAvailable;
    entity.subName = product.subName;
    entity.productFullName = product.productFullName;
    entity.lengths = product.lengths;
    entity.serviceMainType = product.serviceMainType;
    entity.productReal = product.productReal;
    entity.tier = product.tier;
    entity.rating = product.rating;
    entity.orderNo = product.orderNo;
    entity.criteria = product.criteria;
    entity.notes = product.notes;
    entity.createdAt = product.createdAt;
    entity.updatedAt = product.updatedAt;
    entity.deletedAt = product.deletedAt;

    return entity;
  }
}
