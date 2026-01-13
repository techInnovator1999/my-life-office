import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrokerEntity } from '@/brokers/infrastructure/persistence/relational/entities/broker.entity';
import { BrokerSeedService } from './broker-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([BrokerEntity])],
  providers: [BrokerSeedService],
  exports: [BrokerSeedService],
})
export class BrokerSeedModule {}
