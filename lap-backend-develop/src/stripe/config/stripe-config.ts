import { registerAs } from '@nestjs/config';
import { IsNumber, IsString } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { StripeConfig } from './stripe-config.type';
import { Type } from 'class-transformer';

class EnvironmentVariablesValidator {
  @IsString()
  STRIPE_PUBLISHABLE_KEY: string;

  @IsString()
  STRIPE_SECRET_KEY: string;

  @IsString()
  STRIPE_API_VERSION: string;

  @IsString()
  STRIPE_WEBHOOK_SECRET_KEY: string;

  @Type(() => Number) // Transform to number
  @IsNumber() // Check that it’s an integer
  STRIPE_OTHER_FEES_PERCENT: number;
}

export default registerAs<StripeConfig>('stripe', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecretKey: process.env.STRIPE_WEBHOOK_SECRET_KEY,
    stripeApiVersion: process.env.STRIPE_API_VERSION,
    description_one: process.env.DESCRIPTION_ONE,
    description_two: process.env.DESCRIPTION_TWO,
    otherFeesPercent: parseInt(
      process.env.STRIPE_OTHER_FEES_PERCENT?.trim() || '0',
      10,
    ),
  };
});
