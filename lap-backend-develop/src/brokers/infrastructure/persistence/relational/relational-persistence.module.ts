import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrokerRepository } from '../broker.repository';
import { BrokerEntity } from './entities/broker.entity';
import { BrokerRelationalRepository } from './repositories/broker.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BrokerEntity])],
  providers: [
    {
      provide: BrokerRepository,
      useClass: BrokerRelationalRepository,
    },
  ],
  exports: [BrokerRepository],
})
export class ReltionalPersistenceBrokersModule {}
