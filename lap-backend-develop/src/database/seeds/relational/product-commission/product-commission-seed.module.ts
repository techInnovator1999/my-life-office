import { PaycodeEntity } from '@/paycodes/infrastructure/persistence/relational/entities/paycode.entity';
import { ProductCommissionEntity } from '@/product-commissions/infrastructure/persistence/relational/entities/product-commission.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCommissionSeedService } from './product-commission-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCommissionEntity, PaycodeEntity])],
  providers: [ProductCommissionSeedService],
  exports: [ProductCommissionSeedService],
})
export class ProductCommissionSeedModule {}
