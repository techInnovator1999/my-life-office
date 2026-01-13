import { ProductSold } from '@/product-sold/domain/product-sold';
import { ProductSoldEntity } from '../entities/product-sold.entity';

export class ProductSoldMapper {
  static toDomain(raw: ProductSoldEntity): ProductSold {
    const domain = new ProductSold();
    domain.id = raw.id;
    domain.label = raw.label;
    domain.value = raw.value;
    domain.order = raw.order;
    domain.isActive = raw.isActive;
    domain.createdAt = raw.createdAt;
    domain.updatedAt = raw.updatedAt;
    domain.deletedAt = raw.deletedAt;
    return domain;
  }

  static toPersistence(domain: ProductSold): ProductSoldEntity {
    const entity = new ProductSoldEntity();
    entity.id = domain.id;
    entity.label = domain.label;
    entity.value = domain.value;
    entity.order = domain.order;
    entity.isActive = domain.isActive;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.deletedAt = domain.deletedAt;
    return entity;
  }
}

