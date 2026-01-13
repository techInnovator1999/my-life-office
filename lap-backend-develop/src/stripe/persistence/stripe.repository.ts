import { StripeWebhook } from '../domain/stripe';

export abstract class StripeWebhookRepository {
  abstract createMany(
    data: Array<
      Omit<StripeWebhook, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>
    >,
  ): Promise<Array<StripeWebhook>>;

  abstract deleteMany(ids: Array<StripeWebhook['id']>): Promise<boolean>;
  abstract countEarningCurrentWeek(): Promise<{ count: number }>;
  abstract retrievePaymentDetails(): Promise<{ totalAmount: any }>;
}
