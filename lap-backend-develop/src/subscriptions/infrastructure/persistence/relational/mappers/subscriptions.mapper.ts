import { Subscription } from '@/subscriptions/domain/subscription';
import { SubscriptionEntity } from '../entities/subscription.entity';

export class SubscriptionMapper {
  static toDomain(subscription: SubscriptionEntity): Subscription {
    const domain = new Subscription();
    domain.name = subscription.name;
    domain.description = subscription.description ?? null;
    domain.createdAt = subscription.createdAt;
    domain.updatedAt = subscription.updatedAt;
    domain.deletedAt = subscription.deletedAt ?? null;

    return domain;
  }

  static toPersistence(subscription: Subscription): SubscriptionEntity {
    const entity = new SubscriptionEntity();
    entity.name = subscription.name;
    if (subscription.description) {
      entity.description = subscription.description;
    }
    entity.createdAt = subscription.createdAt;
    entity.updatedAt = subscription.updatedAt;
    entity.deletedAt = subscription.deletedAt ?? null;

    return entity;
  }
}
