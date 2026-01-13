import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './infrastructure/persistence/product.repository';
import { Product } from './domain/product';
import { NullableType } from '@/utils/types/nullable.type';
import { FilterProductDto, SortProductDto } from './dto/query-product.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './infrastructure/persistence/relational/entities/product.entity';
import { SwapProductOrderDto } from './dto/swap-product-order.dto';
import { ProductCommission } from '@/product-commissions/domain/product-commission';
import { DeepPartial } from 'typeorm';
import { DepositTypesService } from '@/deposit-types/deposit-types.service';
import { PaycodesService } from '@/paycodes/paycodes.service';
import { CarriersService } from '@/carriers/carriers.service';
import { SubService } from '@/services/subService.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly paycodeService: PaycodesService,
    private readonly depositTypeService: DepositTypesService,
    private readonly carrierService: CarriersService,
    private readonly subService: SubService,
  ) {}

  /**
   * Create a new product
   * @param createProductDto - Product data to create
   * @returns Created product
   */
  async create(
    // data: Omit<Product, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
    data: CreateProductDto,
  ): Promise<Product> {
    const carrier = await this.carrierService.findOrFail(data.carrierId);
    const serviceSubType = await this.subService.findOrFail(
      data.serviceSubTypeId,
    );
    const depositType = await this.depositTypeService.findOne(
      data.depositTypeId,
    );
    if (!depositType) {
      throw new NotFoundException(
        `Deposit type "${data.depositTypeId}" not found.`,
      );
    }

    const product = new Product();
    product.name = data.name;
    product.carrier = carrier;
    product.serviceSubType = serviceSubType;
    product.depositType = depositType;
    product.stateAvailable = data.stateAvailable;
    product.subName = data.subName;
    product.serviceMainType = data.serviceMainType;
    product.productFullName = data.productFullName;
    product.criteria = data.criteria;
    product.notes = data.notes;
    product.lengths = data.lengths;
    product.productReal = data.productReal;
    product.tier = data.tier;
    product.rating = data.rating;

    product.productCommissions = [];

    for (const item of data.productCommissions || []) {
      const paycode = await this.paycodeService.findByNameAndCarrierId(
        item.paycodeName,
        carrier.id,
      );
      if (!paycode) {
        throw new NotFoundException(
          `Paycode "${item.paycodeName}" not found for carrier.`,
        );
      }

      const commission = new ProductCommission();
      commission.paycode = paycode;
      commission.commission = item.commission;

      product.productCommissions.push(commission);
    }

    return this.productRepository.create(product);
  }

  findManyWithPagination({
    filterOptions,
    id,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterProductDto | null;
    id?: string | null;
    sortOptions?: SortProductDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<{ total: number; data: Product[] }> {
    return this.productRepository.findManyWithPagination({
      filterOptions,
      id,
      sortOptions,
      paginationOptions,
    });
  }

  // findMany(fields: EntityCondition<Product>): Promise<GetAllProductsDto[]> {
  //   return this.productRepository.findMany(fields);
  // }

  // findAllWithConditions(
  //   where: FindOptionsWhere<ProductEntity>,
  //   page?: number,
  //   limit?: number,
  // ): Promise<{ entities: ProductEntity[]; total: number }> {
  //   return this.productRepository.findAllWithConditions(where, page, limit);
  // }

  // findOne(
  //   fields: FindOneOptions<ProductEntity>,
  // ): Promise<NullableType<ProductEntity>> {
  //   this.productRepository.findOne(fields);
  //   return this.productRepository.findOne(fields);
  // }

  async findOneById(id: Product['id']): Promise<NullableType<Product>> {
    const product = await this.productRepository.findOneById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(
    id: Product['id'],
    payload: DeepPartial<Product>,
  ): Promise<ProductEntity | null> {
    // Convert DTO fields to domain types
    // const updatedData: Partial<Product> = { ...payload };
    return this.productRepository.update(id, payload);
  }

  countTotalProducts(
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ count: number }> {
    return this.productRepository.countTotalProducts(startDate, endDate);
  }

  async hardDelete(id: Product['id']): Promise<void> {
    const product = await this.productRepository.findOne({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.productRepository.delete(id);
  }

  async swapProductOrders(dto: SwapProductOrderDto) {
    const { ids } = dto;
    const id1 = ids[0];
    const id2 = ids[1];
    const p1 = await this.productRepository.findOneById(id1);
    if (!p1) {
      throw new NotFoundException('Product not found');
    }
    const p2 = await this.productRepository.findOneById(id2);
    if (!p2) {
      throw new NotFoundException('Product not found');
    }

    return this.productRepository.swapOrders(p1, p2);
  }
}
