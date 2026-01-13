import { Module } from '@nestjs/common';
import { ProductCommissionsGridService } from './product-commissions-grid.service';
import { ProductCommissionsGridController } from './product-commissions-grid.controller';
import { UsersModule } from '@/users/users.module';
import { ServicesModule } from '@/services/services.module';
import { CarriersModule } from '@/carriers/carriers.module';
import { RelationalProductCommissionPeristenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    RelationalProductCommissionPeristenceModule,
    UsersModule,
    CarriersModule,
    ServicesModule,
  ],
  controllers: [ProductCommissionsGridController],
  providers: [ProductCommissionsGridService],
  exports: [ProductCommissionsGridService],
})
export class ProductCommissionsGridModule {}
