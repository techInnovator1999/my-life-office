import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductRepository } from '../product.repository';
import { ProductRelationalRepository } from './repositories/product.repository';
import { CarrierEntity } from '@/carriers/infrastructure/persistence/relational/entities/carrier.entity';
import { DepositTypeEntity } from '@/deposit-types/infrastructure/persistence/relational/entities/deposit-type.entity';
import { ProductCommissionEntity } from '@/product-commissions/infrastructure/persistence/relational/entities/product-commission.entity';
import { ServiceMainEntity } from '@/services/infrastructure/persistence/relational/entities/service-main.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      ServiceMainEntity,
      DepositTypeEntity,
      ProductCommissionEntity,
      CarrierEntity,
    ]),
  ],
  providers: [
    {
      provide: ProductRepository,
      useClass: ProductRelationalRepository,
    },
  ],
  exports: [ProductRepository],
})
export class RelationalPersistenceProductsModule {}
