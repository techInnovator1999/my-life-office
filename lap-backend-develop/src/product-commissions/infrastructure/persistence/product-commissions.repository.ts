import { DeepPartial, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { ProductCommission } from '../../domain/product-commission';
import {
  FilterProductCommissionDto,
  SortProductCommissionDto,
} from '../../dto/query-product-commission.dto';
import { ProductCommissionEntity } from './relational/entities/product-commission.entity';

export abstract class ProductCommissionsRepository {
  abstract create(
    payload: Omit<
      ProductCommission,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >,
  ): Promise<ProductCommissionEntity>;

  abstract findById(
    id: ProductCommission['id'],
  ): Promise<ProductCommissionEntity | null>;

  abstract update(
    id: ProductCommission['id'],
    payload: DeepPartial<ProductCommission>,
  ): Promise<ProductCommission>;

  abstract softDelete(id: ProductCommission['id']): Promise<void>;

  abstract delete(id: ProductCommission['id']): Promise<void>;

  abstract findManyWithPagination({
    filterOptions,
    id,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterProductCommissionDto | null;
    id?: ProductCommission['id'] | null;
    sortOptions?: SortProductCommissionDto | null;
    paginationOptions: {
      page: number;
      limit: number;
    };
  }): Promise<{ total: number; data: ProductCommissionEntity[] }>;

  abstract findOnBy(
    options: FindOptionsWhere<ProductCommissionEntity>,
  ): Promise<ProductCommissionEntity | null>;

  abstract findOne(
    options: FindOneOptions<ProductCommissionEntity>,
  ): Promise<ProductCommissionEntity | null>;

  abstract findByPaycodeId(
    paycodeId: string,
  ): Promise<ProductCommissionEntity[]>;

  abstract findByPaycodeIdAndProductId(
    paycodeId: string,
    productId: string,
  ): Promise<ProductCommissionEntity | null>;
}
