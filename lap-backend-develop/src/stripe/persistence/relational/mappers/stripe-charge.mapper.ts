import { StripeCharge } from '@/stripe/domain/stripe-charge';
import { StripeChargeEntity } from '../entities/stripe-charge.entity';

export class StripeChargeMapper {
  static toDomain(raw: StripeChargeEntity): StripeCharge {
    const stripe = new StripeCharge();
    stripe.id = raw.id;
    stripe.chargeId = raw.chargeId;
    stripe.status = raw.status;
    stripe.amountCaptured = raw.amountCaptured;
    stripe.description = raw.description!;
    stripe.customer = raw.customer!;
    stripe.createdAt = raw.createdAt;
    return stripe;
  }

  static toPersistence(stripe: StripeCharge): StripeChargeEntity {
    const stripeChargeEntity = new StripeChargeEntity();
    stripeChargeEntity.id = stripe.id;
    stripeChargeEntity.amountCaptured = stripe.amountCaptured;
    stripeChargeEntity.chargeId = stripe.chargeId;
    stripeChargeEntity.status = stripe.status;
    stripeChargeEntity.description = stripe.description;
    stripeChargeEntity.customer = stripe.customer;
    stripeChargeEntity.createdAt = stripe.createdAt;
    return stripeChargeEntity;
  }
}
