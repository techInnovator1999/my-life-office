import { Module } from '@nestjs/common';
import { PaycodeSeedService } from './paycode-seed.service';
import { CarrierEntity } from '@/carriers/infrastructure/persistence/relational/entities/carrier.entity';
import { PaycodeEntity } from '@/paycodes/infrastructure/persistence/relational/entities/paycode.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PaycodeEntity, CarrierEntity])],
  providers: [PaycodeSeedService],
  exports: [PaycodeSeedService],
})
export class PaycodeSeedModule {}
