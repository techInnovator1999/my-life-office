import { Module } from '@nestjs/common';
import { MasterPaycodeMappingService } from './master-paycode-mapping.service';
import { RelationalPersistenceMasterPaycodeMappingModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { UsersModule } from '@/users/users.module';
import { PaycodesModule } from '@/paycodes/paycodes.module';
import { ProductCommissionsModule } from '@/product-commissions/product-commissions.module';
import { MasterPaycodeModule } from '@/master-paycode/master-paycode.module';
import { CompanyModule } from '@/company/company.module';
import { MasterPaycodeMappingController } from './master-paycode-mapping.controller';

@Module({
  imports: [
    RelationalPersistenceMasterPaycodeMappingModule,
    UsersModule,
    PaycodesModule,
    ProductCommissionsModule,
    MasterPaycodeModule,
    CompanyModule,
  ],
  controllers: [MasterPaycodeMappingController],
  providers: [MasterPaycodeMappingService],
})
export class MasterPaycodeMappingModule {}
