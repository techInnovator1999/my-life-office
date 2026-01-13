import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Allow, IsJSON, IsString, IsBoolean } from 'class-validator';

import Stripe from 'stripe';
import { WebhookEvents } from '@/stripe/stripe.enum';

@Entity()
export class StripeWebhookEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Allow()
  @Column({ type: 'json' })
  @IsJSON()
  payload: Stripe.Event;

  @Allow()
  @Column()
  @IsString()
  type: WebhookEvents;

  @Allow()
  @Column()
  @IsBoolean()
  isDequeued: boolean;

  @Allow()
  @Column()
  @IsBoolean()
  isSuccess: boolean;

  @Allow()
  @Column({ nullable: true })
  @IsString()
  exception?: string;
}
