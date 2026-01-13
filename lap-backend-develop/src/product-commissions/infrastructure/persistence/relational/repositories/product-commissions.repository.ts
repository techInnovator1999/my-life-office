import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductCommission } from '@/product-commissions/domain/product-commission';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import {
  FilterProductCommissionDto,
  SortProductCommissionDto,
} from '@/product-commissions/dto/query-product-commission.dto';
import { ProductCommissionsRepository } from '@/product-commissions/infrastructure/persistence/product-commissions.repository';
import { ProductCommissionEntity } from '../entities/product-commission.entity';
import { ProductCommissionMapper } from '../mappers/product-commission.mapper';

@Injectable()
export class ProductCommissionRelationalRepository
  implements ProductCommissionsRepository
{
  constructor(
    @InjectRepository(ProductCommissionEntity)
    private readonly productCommissionRepo: Repository<ProductCommissionEntity>,
  ) {}
  /**
   * Creates a new product commission.
   * @param payload The data to create the product commission.
   * @returns The created product commission.
   */
  async create(payload: ProductCommission): Promise<ProductCommissionEntity> {
    const entity = ProductCommissionMapper.toPersistence(payload);
    const savedEntity = await this.productCommissionRepo.save(entity);
    return savedEntity;
  }

  /**
   * Finds a product commission by its ID.
   * @param id The ID of the product commission to find.
   * @returns The found product commission.
   */
  async findById(
    id: ProductCommission['id'],
  ): Promise<ProductCommissionEntity | null> {
    return this.productCommissionRepo.findOne({
      where: { id },
      relations: {
        product: true,
        paycode: true,
      },
    });
  }

  async softDelete(id: ProductCommission['id']): Promise<void> {
    await this.productCommissionRepo.softDelete(id);
  }

  async delete(id: ProductCommission['id']): Promise<void> {
    await this.productCommissionRepo.delete(id);
  }

  /**
   * updates a product commission by its ID.
   * @param id The ID of the product commission to update.
   * @param payload The data to update the product commission.
   * @returns The updated product commission.
   */
  async update(
    id: ProductCommission['id'],
    payload: Partial<ProductCommission>,
  ): Promise<ProductCommission> {
    const entity = await this.productCommissionRepo.findOne({
      where: { id },
      relations: {
        product: true,
        // paycodes: true,
      },
    });
    if (!entity) {
      throw new NotFoundException(`Product commission with ID ${id} not found`);
    }

    const updatedData = ProductCommissionMapper.toPersistence({
      ...ProductCommissionMapper.toDomain(entity),
      ...payload,
    });
    Object.assign(entity, updatedData);

    // Save the updated entity to the database
    const updatedEntity = await this.productCommissionRepo.save(entity);
    return ProductCommissionMapper.toDomain(updatedEntity);
  }

  /**
   * Finds all product commissions with pagination.
   * @param paginationOptions The pagination options.
   * @returns The paginated product commissions.
   */
  async findManyWithPagination({
    filterOptions,
    id,
    // sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterProductCommissionDto | null;
    id?: string | null;
    sortOptions?: SortProductCommissionDto | null;
    paginationOptions: { page: number; limit: number };
  }): Promise<{ total: number; data: ProductCommissionEntity[] }> {
    const where: FindOptionsWhere<ProductCommissionEntity> = {};
    if (id) {
      where.id = id;
    }

    if (filterOptions) {
      if (filterOptions['name']) {
        // where.name = filterOptions.name;
      }
      // if (filterOptions['productId']) {
      //   where.product = { id: filterOptions.productId };
      // }
      // if (filterOptions['commissionLevelId']) {
      //   where.commissionLevel = { id: filterOptions.commissionLevelId };
      // }
    }

    const [results, total] = await this.productCommissionRepo.findAndCount({
      where,
      relations: {
        product: true,
        // commissionLevel: true,
        // paycodes: true,
      },
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return {
      total,
      // data: results.map((entity) => ProductCommissionMapper.toDomain(entity)),
      data: results,
    };
  }

  findOnBy(
    options: FindOptionsWhere<ProductCommissionEntity>,
  ): Promise<ProductCommissionEntity | null> {
    return this.productCommissionRepo.findOneBy(options);
  }

  async findOne(
    options: FindOneOptions<ProductCommissionEntity>,
  ): Promise<ProductCommissionEntity | null> {
    return this.productCommissionRepo.findOne(options);
  }

  async findByPaycodeId(paycodeId: string): Promise<ProductCommissionEntity[]> {
    return this.productCommissionRepo.find({
      where: { paycode: { id: paycodeId } },
      relations: ['paycode'],
    });
  }

  findByPaycodeIdAndProductId(
    paycodeId: string,
    productId: string,
  ): Promise<ProductCommissionEntity | null> {
    return this.productCommissionRepo.findOne({
      where: { paycode: { id: paycodeId }, product: { id: productId } },
      relations: ['paycode', 'product'],
    });
  }
}
