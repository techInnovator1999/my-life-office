import { Product } from '../../domain/product';
import { NullableType } from 'src/utils/types/nullable.type';
import { FilterProductDto, SortProductDto } from '../../dto/query-product.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { ProductEntity } from './relational/entities/product.entity';
import { DeepPartial, FindOptionsWhere } from 'typeorm';

export abstract class ProductRepository {
  abstract create(
    data: Omit<Product, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Product>;

  abstract findManyWithPagination({
    filterOptions,
    id,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterProductDto | null;
    id?: Product['id'] | null;
    sortOptions?: SortProductDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<{ total: number; data: Product[] }>; // GetAllProductsDto

  // abstract findMany(
  //   fields: EntityCondition<Product>,
  // ): Promise<GetAllProductsDto[]>;

  abstract findAllWithConditions(
    where: FindOptionsWhere<ProductEntity>,
    page?: number,
    limit?: number,
  ): Promise<{
    entities: ProductEntity[];
    total: number;
  }>;

  abstract findOne(
    fields: EntityCondition<Product>,
    isAdmin?: boolean,
  ): Promise<NullableType<Product>>;

  abstract findOneById(id: Product['id']): Promise<NullableType<Product>>;

  abstract update(
    id: Product['id'],
    payload: DeepPartial<Product>,
  ): Promise<ProductEntity>;

  abstract countTotalProducts(
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ count: number }>;

  // abstract countActiveProducts(
  //   role?: string | null,
  //   user?: string | null,
  // ): Promise<{ count: number }>;

  abstract softDelete(id: Product['id']): Promise<void>;

  abstract delete(id: Product['id']): Promise<void>;

  abstract swapOrders(p1: Product, p2: Product);
}
