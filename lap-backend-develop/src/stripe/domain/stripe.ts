import { ApiProperty } from '@nestjs/swagger';
import Stripe from 'stripe';
import { WebhookEvents } from '../stripe.enum';

export class StripeWebhook {
  @ApiProperty()
  id: number;

  @ApiProperty()
  payload: Stripe.Event;

  @ApiProperty()
  type: WebhookEvents;

  @ApiProperty()
  isDequeued: boolean;

  @ApiProperty()
  isSuccess: boolean;

  @ApiProperty()
  exception?: string;
}
