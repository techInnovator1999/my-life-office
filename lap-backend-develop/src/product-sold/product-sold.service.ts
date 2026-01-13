import { Injectable } from '@nestjs/common';
import { ProductSold } from './domain/product-sold';
import { ProductSoldRepository } from './infrastructure/persistence/product-sold.repository';
import { QueryProductSoldDto } from './dto/query-product-sold.dto';

@Injectable()
export class ProductSoldService {
  constructor(
    private readonly productSoldRepository: ProductSoldRepository,
  ) {}

  async findAll(query?: QueryProductSoldDto): Promise<ProductSold[]> {
    return this.productSoldRepository.findAll(query);
  }

  async findOne(id: string): Promise<ProductSold | null> {
    return this.productSoldRepository.findOne(id);
  }
}

