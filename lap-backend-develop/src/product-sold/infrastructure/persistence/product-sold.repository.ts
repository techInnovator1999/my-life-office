import { ProductSold } from '@/product-sold/domain/product-sold';
import { QueryProductSoldDto } from '@/product-sold/dto/query-product-sold.dto';

export abstract class ProductSoldRepository {
  abstract findAll(query?: QueryProductSoldDto): Promise<ProductSold[]>;
  abstract findOne(id: string): Promise<ProductSold | null>;
}

