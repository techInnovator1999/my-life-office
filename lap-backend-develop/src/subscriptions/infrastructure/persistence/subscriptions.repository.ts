import { CreateSubscriptionDto } from '@/subscriptions/dto/create-subscription.dto';
import { SubscriptionEntity } from './relational/entities/subscription.entity';

export abstract class SubscriptionsRepository {
  abstract create(
    subscription: CreateSubscriptionDto,
  ): Promise<SubscriptionEntity>;

  abstract findAll(): Promise<any>;

  abstract findOne(id: string): Promise<SubscriptionEntity>;

  abstract update(id: string, subscription: any): Promise<SubscriptionEntity>;

  abstract remove(id: string): Promise<void>;
}
