import { Module } from '@nestjs/common';
import { ProductSoldService } from './product-sold.service';
import { ProductSoldController } from './product-sold.controller';
import { ProductSoldPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [ProductSoldPersistenceModule],
  controllers: [ProductSoldController],
  providers: [ProductSoldService],
  exports: [ProductSoldService],
})
export class ProductSoldModule {}

