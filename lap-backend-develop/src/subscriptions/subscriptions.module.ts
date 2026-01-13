import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsRepository } from './infrastructure/persistence/subscriptions.repository';
import { SubscriptionsRelationalRepository } from './infrastructure/persistence/relational/repositories/subscriptions.repository';
import { SubscriptionEntity } from './infrastructure/persistence/relational/entities/subscription.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionEntity]), UsersModule],
  controllers: [SubscriptionsController],
  providers: [
    SubscriptionsService,
    {
      provide: SubscriptionsRepository,
      useClass: SubscriptionsRelationalRepository,
    },
  ],
})
export class SubscriptionsModule {}
