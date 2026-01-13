import { Module } from '@nestjs/common';
import { MasterPaycodeService } from './master-paycode.service';
import { MasterPaycodeController } from './master-paycode.controller';
import { UsersModule } from '@/users/users.module';
import { RelationalMasterPaycodePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalMasterPaycodePersistenceModule, UsersModule],
  controllers: [MasterPaycodeController],
  providers: [MasterPaycodeService],
  exports: [MasterPaycodeService, RelationalMasterPaycodePersistenceModule],
})
export class MasterPaycodeModule {}
