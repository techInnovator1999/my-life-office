import { Module } from '@nestjs/common';
import { CarriersService } from './carriers.service';
import { CarriersController } from './carriers.controller';
import { UsersModule } from '@/users/users.module';
import { PaycodesModule } from '@/paycodes/paycodes.module';
import { RelationalPersistenceCarriersModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalPersistenceCarriersModule, UsersModule, PaycodesModule],
  controllers: [CarriersController],
  providers: [CarriersService],
  exports: [CarriersService],
})
export class CarriersModule {}
