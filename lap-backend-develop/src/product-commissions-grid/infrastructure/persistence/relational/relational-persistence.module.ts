import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCommissionEntity } from '@/product-commissions/infrastructure/persistence/relational/entities/product-commission.entity';
import { ProductEntity } from '@/products/infrastructure/persistence/relational/entities/product.entity';
import { ProductCommissionGridRepository } from '../product-commissions-grid.repository';
import { ProductCommissionsGridRelationalRepository } from './repositories/product-commissions-grid.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCommissionEntity, ProductEntity])],
  providers: [
    {
      provide: ProductCommissionGridRepository,
      useClass: ProductCommissionsGridRelationalRepository,
    },
  ],
  exports: [
    ProductCommissionGridRepository,
    RelationalProductCommissionPeristenceModule,
  ],
})
export class RelationalProductCommissionPeristenceModule {}
