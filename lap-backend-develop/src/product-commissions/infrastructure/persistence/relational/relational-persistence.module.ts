import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCommissionEntity } from './entities/product-commission.entity';
import { Module } from '@nestjs/common';
import { ProductCommissionRelationalRepository } from './repositories/product-commissions.repository';
import { ProductCommissionsRepository } from '../product-commissions.repository';
import { ProductEntity } from '@/products/infrastructure/persistence/relational/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCommissionEntity, ProductEntity])],
  providers: [
    {
      provide: ProductCommissionsRepository,
      useClass: ProductCommissionRelationalRepository,
    },
  ],
  exports: [ProductCommissionsRepository],
})
export class ProductCommissionsRelationalPersistenceModule {}
