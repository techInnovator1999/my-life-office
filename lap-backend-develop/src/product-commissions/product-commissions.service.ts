import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductCommissionsRepository } from './infrastructure/persistence/product-commissions.repository';
import { ProductCommission } from './domain/product-commission';
import { CreateProductCommissionDto } from './dto/create-product-commission.dto';
import { ProductCommissionEntity } from './infrastructure/persistence/relational/entities/product-commission.entity';
import { Product } from '@/products/domain/product';
import { Paycode } from '@/paycodes/domain/paycode';
import { DeepPartial } from 'typeorm';

@Injectable()
export class ProductCommissionsService {
  constructor(
    private readonly productCommissionsRepository: ProductCommissionsRepository,
  ) {}

  /**
   * create new product commission
   */
  async create(data: CreateProductCommissionDto): Promise<ProductCommission> {
    const domain = new ProductCommission();
    domain.commission = data.commission ?? 0;

    // Only assign ID for related entities (rest will be fetched when needed)
    domain.product = { id: data.product.id } as Product;
    domain.paycode = { id: data.paycode.id } as Paycode;
    const newProductCommission =
      await this.productCommissionsRepository.create(domain);
    return newProductCommission;
  }

  async update(
    id: string,
    data: DeepPartial<ProductCommission>,
  ): Promise<ProductCommission> {
    const updatedProductCommission =
      await this.productCommissionsRepository.update(id, data);
    return updatedProductCommission;
  }

  async findById(id: string): Promise<ProductCommissionEntity> {
    const productCommission =
      await this.productCommissionsRepository.findById(id);
    if (!productCommission) {
      throw new NotFoundException(`Product commission with ID ${id} not found`);
    }
    return productCommission;
  }

  async softDelete(id: string): Promise<void> {
    await this.productCommissionsRepository.softDelete(id);
  }

  async delete(id: string): Promise<void> {
    await this.productCommissionsRepository.delete(id);
  }

  async findManyWithPagination({
    filterOptions,
    id,
    // sortOptions,
    paginationOptions,
  }: {
    filterOptions?: Record<string, any> | null;
    id?: string | null;
    // sortOptions?: Record<string, string> | null;
    paginationOptions: {
      page: number;
      limit: number;
    };
  }): Promise<{ total: number; data: ProductCommissionEntity[] }> {
    return this.productCommissionsRepository.findManyWithPagination({
      filterOptions,
      id,
      // sortOptions,
      paginationOptions,
    });
  }

  findByPaycodeId(paycodeId: string): Promise<ProductCommissionEntity[]> {
    return this.productCommissionsRepository.findByPaycodeId(paycodeId);
  }

  findByPaycodeIdAndProductId(
    paycodeId: string,
    productId: string,
  ): Promise<ProductCommissionEntity | null> {
    return this.productCommissionsRepository.findByPaycodeIdAndProductId(
      paycodeId,
      productId,
    );
  }
}
