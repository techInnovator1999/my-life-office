import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { ConfigModule } from '@nestjs/config';
import { RelationalStripeWebhookPersistenceModule } from './persistence/relational/relational-persistence.module';
import { StripeWebhookEntity } from './persistence/relational/entities/stripe.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeChargeEntity } from './persistence/relational/entities/stripe-charge.entity';
import { RelationalPlanPersistenceModule } from '@/plan/persistence/relational/relational-persistence.module';
import { RelationalUserPersistenceModule } from '@/users/infrastructure/persistence/relational/relational-persistence.module';
import { MailModule } from '@/mail/mail.module';
import { PushNotificationModule } from '@/notification/push.notification.module';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StripeWebhookEntity, StripeChargeEntity]),
    ConfigModule,
    MailModule,
    PushNotificationModule,
    UsersModule,
    RelationalStripeWebhookPersistenceModule,
    RelationalPlanPersistenceModule,
    RelationalUserPersistenceModule,
    UsersModule,
  ],
  controllers: [StripeController],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
