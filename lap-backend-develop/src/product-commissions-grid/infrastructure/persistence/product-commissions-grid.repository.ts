import { ProductEntity } from '@/products/infrastructure/persistence/relational/entities/product.entity';

export abstract class ProductCommissionGridRepository {
  abstract getProductCommissionsByCarrier(
    carrierId: string,
    page: number,
    limit: number,
  ): Promise<{ entities: ProductEntity[]; total: number }>;
}
