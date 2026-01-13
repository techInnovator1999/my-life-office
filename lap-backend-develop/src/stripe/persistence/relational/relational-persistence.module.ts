import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeWebhookEntity } from './entities/stripe.entity';
import { StripeWebhookRepository } from '../stripe.repository';
import { StripeWebhookRelationalRepository } from './repositories/stripe.repository';
import { StripeChargeEntity } from './entities/stripe-charge.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StripeWebhookEntity, StripeChargeEntity]),
  ],
  providers: [
    {
      provide: StripeWebhookRepository,
      useClass: StripeWebhookRelationalRepository,
    },
  ],
  exports: [StripeWebhookRepository],
})
export class RelationalStripeWebhookPersistenceModule {}
