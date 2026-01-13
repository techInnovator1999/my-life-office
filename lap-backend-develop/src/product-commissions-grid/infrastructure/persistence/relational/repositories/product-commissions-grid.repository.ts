import { InjectRepository } from '@nestjs/typeorm';
import { ProductCommissionGridRepository } from '../../product-commissions-grid.repository';
import { ProductEntity } from '@/products/infrastructure/persistence/relational/entities/product.entity';
import { Repository } from 'typeorm';

export class ProductCommissionsGridRelationalRepository
  implements ProductCommissionGridRepository
{
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}
  async getProductCommissionsByCarrier(
    carrierId: string,
    page: number,
    limit: number,
  ): Promise<{ entities: ProductEntity[]; total: number }> {
    const subQuery = this.productRepo
      .createQueryBuilder('p')
      .select('p.id')
      .where('p.carrierId = :carrierId', { carrierId })
      .skip((page - 1) * limit)
      .take(limit);

    const products = await this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productCommissions', 'productCommission')
      .leftJoinAndSelect('productCommission.paycode', 'paycode')
      .where(`product.id IN (${subQuery.getQuery()})`)
      .setParameters(subQuery.getParameters())
      .orderBy('product.createdAt', 'ASC')
      .addOrderBy('paycode.createdAt', 'ASC')
      .getMany();

    const total = await this.productRepo
      .createQueryBuilder('p')
      .where('p.carrierId = :carrierId', { carrierId })
      .getCount();

    return { entities: products, total };
  }
}
