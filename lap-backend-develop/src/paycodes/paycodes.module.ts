import { Module } from '@nestjs/common';
import { PaycodesService } from './paycodes.service';
import { PaycodesController } from './paycodes.controller';
import { UsersModule } from '@/users/users.module';
import { RelationalPaycodesPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [UsersModule, RelationalPaycodesPersistenceModule],
  controllers: [PaycodesController],
  providers: [PaycodesService],
  exports: [PaycodesService, RelationalPaycodesPersistenceModule],
})
export class PaycodesModule {}
