import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '@/products/infrastructure/persistence/relational/entities/product.entity';
import { ProductSeedService } from './product-seed.service';
import { SubTypeSeedModule } from '../subType/subType-seed.module';
import { CarrierSeedModule } from '../carrier/carrier-seed.module';
import { ProductCommissionSeedModule } from '../product-commission/product-commission-seed.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    SubTypeSeedModule,
    CarrierSeedModule,
    ProductCommissionSeedModule,
  ],
  providers: [ProductSeedService],
  exports: [ProductSeedService],
})
export class ProductSeedModule {}
