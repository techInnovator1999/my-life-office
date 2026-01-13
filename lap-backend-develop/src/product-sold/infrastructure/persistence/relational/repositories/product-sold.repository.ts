import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductSoldRepository } from '../../product-sold.repository';
import { ProductSoldEntity } from '../entities/product-sold.entity';
import { ProductSold } from '@/product-sold/domain/product-sold';
import { ProductSoldMapper } from '../mappers/product-sold.mapper';
import { QueryProductSoldDto } from '@/product-sold/dto/query-product-sold.dto';

@Injectable()
export class ProductSoldRelationalRepository implements ProductSoldRepository {
  constructor(
    @InjectRepository(ProductSoldEntity)
    private readonly productSoldRepository: Repository<ProductSoldEntity>,
  ) {}

  async findAll(query?: QueryProductSoldDto): Promise<ProductSold[]> {
    const queryBuilder = this.productSoldRepository.createQueryBuilder('product_sold');

    if (query?.isActive !== undefined) {
      queryBuilder.andWhere('product_sold.isActive = :isActive', { isActive: query.isActive });
    }

    if (query?.search) {
      queryBuilder.andWhere(
        '(product_sold.label ILIKE :search OR product_sold.value ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    queryBuilder.orderBy('product_sold.order', 'ASC')
                 .addOrderBy('product_sold.label', 'ASC');

    const entities = await queryBuilder.getMany();

    return entities.map((entity) => ProductSoldMapper.toDomain(entity));
  }

  async findOne(id: string): Promise<ProductSold | null> {
    const entity = await this.productSoldRepository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    return ProductSoldMapper.toDomain(entity);
  }
}

