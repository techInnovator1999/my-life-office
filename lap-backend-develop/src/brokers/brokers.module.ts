import { Module } from '@nestjs/common';
import { BrokersService } from './brokers.service';
import { BrokersController } from './brokers.controller';
import { UsersModule } from '@/users/users.module';
import { ReltionalPersistenceBrokersModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [ReltionalPersistenceBrokersModule, UsersModule],
  controllers: [BrokersController],
  providers: [BrokersService],
})
export class BrokersModule {}
