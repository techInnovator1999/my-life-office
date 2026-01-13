import { StripeWebhookEntity } from '../entities/stripe.entity';
import { StripeWebhook } from '@/stripe/domain/stripe';

export class StripeWebhookMapper {
  static toDomain(raw: StripeWebhookEntity): StripeWebhook {
    const stripe = new StripeWebhook();
    stripe.id = raw.id;
    stripe.payload = raw.payload;
    return stripe;
  }

  static toPersistence(stripe: StripeWebhook): StripeWebhookEntity {
    const stripeWebhookEntity = new StripeWebhookEntity();
    stripeWebhookEntity.id = stripe.id;
    stripeWebhookEntity.payload = stripe.payload;
    return stripeWebhookEntity;
  }
}
