import { ProductCommission } from '@/product-commissions/domain/product-commission';
import { ProductCommissionEntity } from '../entities/product-commission.entity';
import { ProductMapper } from '@/products/infrastructure/persistence/relational/mappers/product.mapper';
import { refById } from '@/utils/mapping.helper';
import { ProductEntity } from '@/products/infrastructure/persistence/relational/entities/product.entity';
import { PaycodeMapper } from '@/paycodes/infrastructure/persistence/relational/mappers/paycode.mapper';
import { PaycodeEntity } from '@/paycodes/infrastructure/persistence/relational/entities/paycode.entity';

export class ProductCommissionMapper {
  static toDomain(entity: ProductCommissionEntity): ProductCommission {
    const domain = new ProductCommission();
    domain.id = entity.id;
    if (entity.product) {
      domain.product = ProductMapper.toDomain(entity.product);
    }
    if (entity.paycode) {
      domain.paycode = PaycodeMapper.toDomain(entity.paycode);
    }
    domain.commission = entity.commission;
    domain.createdAt = entity.createdAt;
    domain.updatedAt = entity.updatedAt;
    domain.deletedAt = entity.deletedAt;
    return domain;
  }

  static toPersistence(domain: ProductCommission): ProductCommissionEntity {
    const entity = new ProductCommissionEntity();
    entity.id = domain.id;
    if (domain.product) {
      entity.product = refById<ProductEntity>(domain.product.id);
    }
    entity.commission = domain.commission ?? 0;
    if (domain.paycode) {
      entity.paycode = refById<PaycodeEntity>(domain.paycode.id);
    }
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.deletedAt = domain.deletedAt;
    return entity;
  }
}
