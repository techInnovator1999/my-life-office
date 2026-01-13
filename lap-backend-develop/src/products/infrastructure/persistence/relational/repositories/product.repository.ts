import { Product } from '../../../../domain/product';
import { NullableType } from 'src/utils/types/nullable.type';
import {
  FilterProductDto,
  SortProductDto,
} from '../../../../dto/query-product.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { ProductEntity } from '../entities/product.entity';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../../product.repository';
import { ProductMapper } from '../mappers/product.mapper';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductRelationalRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  async create(product: Product): Promise<Product> {
    const persistenceModel = ProductMapper.toPersistence(product);
    const newEntity = await this.productRepo.save(
      this.productRepo.create(persistenceModel),
    );
    return ProductMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    id,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterProductDto | null;
    id?: Product['id'] | null;
    sortOptions?: SortProductDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<{ total: number; data: Product[] }> {
    const where: FindOptionsWhere<ProductEntity> = {};
    if (filterOptions) {
      if (filterOptions['carrierId']) {
        where.carrier = {
          id: filterOptions.carrierId,
        };
      }
    }
    console.log('product.repository: findManyWithPagination', id, sortOptions);

    const [results, total] = await this.productRepo.findAndCount({
      where,
      relations: {
        carrier: true,
      },
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    return {
      total,
      data: results.map((entity) => ProductMapper.toDomain(entity)),
    };
  }

  //   async findMany(fields: EntityCondition<Product>): Promise<GetAllProductsDto[]> {
  //     const entities = await this.productRepo.find({
  //       where: fields as FindOptionsWhere<ProductEntity>,
  //     });
  //     return entities.map((e) => ProductMapper.toDomain(e));
  //   }

  async findAllWithConditions(
    where: FindOptionsWhere<ProductEntity>,
    page = 1,
    limit = 10,
  ) {
    const [entities, total] = await this.productRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });
    return { entities, total };
  }

  async findOne(
    fields: EntityCondition<Product>,
  ): Promise<NullableType<Product>> {
    const entity = await this.productRepo.findOne({
      where: fields as FindOptionsWhere<ProductEntity>,
      relations: {
        carrier: true,
        serviceSubType: true,
        depositType: true,
        productCommissions: {
          paycode: true,
        },
      },
    });
    return entity ? ProductMapper.toDomain(entity) : null;
  }

  async findOneById(id: string): Promise<NullableType<Product>> {
    const entity = await this.productRepo.findOne({
      where: { id },
      relations: {
        productCommissions: {
          paycode: true,
        },
      },
    });
    return entity ? ProductMapper.toDomain(entity) : null;
  }

  async update(
    id: Product['id'],
    payload: Partial<Product>,
  ): Promise<ProductEntity> {
    const entity = await this.productRepo.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException('Product not found');
    }

    const updatedData = ProductMapper.toPersistence({
      ...ProductMapper.toDomain(entity),
      ...payload,
    });
    // Assign the updated data to the existing entity
    Object.assign(entity, updatedData);

    // Save the updated entity
    const updatedEntity = await this.productRepo.save(entity);

    // Note: domain method suppressed currently. That's not ideal but it was causing circular dependency issues.
    // return ProductMapper.toDomain(updatedEntity);
    return updatedEntity;
  }

  async countTotalProducts(
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ count: number }> {
    const where: FindOptionsWhere<ProductEntity> = {};
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate);
    }

    return {
      count: await this.productRepo.count({
        where: where,
      }),
    };
  }

  //   async countActiveProducts(): Promise<{ count: number }> {
  //     const count = await this.productRepo.count({
  //       where: { active: true },
  //     });
  //     return { count };
  //   }

  async softDelete(id: string): Promise<void> {
    await this.productRepo.softDelete({ id });
  }

  async delete(id: string): Promise<void> {
    await this.productRepo.delete({ id });
  }

  async swapOrders(product1: Product, product2: Product) {
    // Swap order numbers
    const tempOrder = product1.orderNo;
    product1.orderNo = product2.orderNo;
    product2.orderNo = tempOrder;

    // Persist changes
    return this.productRepo.save([product1, product2]);
  }
}
