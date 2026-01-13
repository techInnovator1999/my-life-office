import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSoldEntity } from './entities/product-sold.entity';
import { ProductSoldRepository } from '../product-sold.repository';
import { ProductSoldRelationalRepository } from './repositories/product-sold.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductSoldEntity])],
  providers: [
    {
      provide: ProductSoldRepository,
      useClass: ProductSoldRelationalRepository,
    },
  ],
  exports: [ProductSoldRepository],
})
export class ProductSoldPersistenceModule {}

