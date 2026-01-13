import { Module } from '@nestjs/common';
import { ProductCommissionsService } from './product-commissions.service';
import { ProductCommissionsController } from './product-commissions.controller';
import { UsersModule } from '@/users/users.module';
import { ProductCommissionsRelationalPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [ProductCommissionsRelationalPersistenceModule, UsersModule],
  controllers: [ProductCommissionsController],
  providers: [ProductCommissionsService],
  exports: [ProductCommissionsService],
})
export class ProductCommissionsModule {}
