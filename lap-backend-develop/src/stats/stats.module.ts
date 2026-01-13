import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StatsService } from './stats.service';
import { StripeModule } from '@/stripe/stripe.module';
import { StatsController } from './stats.controller';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [StripeModule, ConfigModule, UsersModule],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
