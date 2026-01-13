import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { UsersModule } from '@/users/users.module';
import { CarriersModule } from '@/carriers/carriers.module';
import { ServicesModule } from '@/services/services.module';
import { DepositTypesModule } from '@/deposit-types/deposit-types.module';
import { RelationalServicesPersistenceModule } from '@/services/infrastructure/persistence/relational/relational-persistence.module';
import { PaycodesModule } from '@/paycodes/paycodes.module';
import { RelationalPersistenceProductsModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    RelationalPersistenceProductsModule,
    UsersModule,
    CarriersModule,
    ServicesModule,
    RelationalServicesPersistenceModule,
    DepositTypesModule,
    PaycodesModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
