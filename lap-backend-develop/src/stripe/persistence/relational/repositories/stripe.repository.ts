import { Injectable } from '@nestjs/common';
import { StripeWebhookRepository } from '../../stripe.repository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StripeWebhookMapper } from '../mappers/stripe.mapper';
import { StripeWebhookEntity } from '../entities/stripe.entity';
import { StripeWebhook } from '@/stripe/domain/stripe';
import { StripeChargeEntity } from '../entities/stripe-charge.entity';
import { StripeChargeMapper } from '../mappers/stripe-charge.mapper';

@Injectable()
export class StripeWebhookRelationalRepository
  implements StripeWebhookRepository
{
  constructor(
    @InjectRepository(StripeWebhookEntity)
    private readonly stripeWebhookRepository: Repository<StripeWebhookEntity>,

    @InjectRepository(StripeChargeEntity)
    private readonly stripeChargeRepository: Repository<StripeChargeEntity>,
  ) {}

  async createCharge(
    data: Array<StripeChargeEntity>,
  ): Promise<Array<StripeChargeEntity>> {
    const persistenceModels = data.map((x) =>
      StripeChargeMapper.toPersistence(StripeChargeMapper.toDomain(x)),
    );
    const newEntities = await this.stripeChargeRepository.save(
      this.stripeChargeRepository.create(persistenceModels),
    );
    return newEntities;
  }

  async retrievePaymentDetails(): Promise<{ totalAmount: any }> {
    const total = await this.stripeChargeRepository
      .createQueryBuilder('stripeCharge')
      .select('SUM(stripeCharge.amountCaptured)', 'totalAmount')
      .getRawOne();

    return {
      totalAmount: Number(total.totalAmount) ?? 0,
    };
  }

  async countEarningCurrentWeek(): Promise<{ count: number }> {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set current date to midnight
    const thresholdDate = new Date(currentDate);
    thresholdDate.setDate(currentDate.getDate() - 7);

    const count = await this.stripeChargeRepository
      .createQueryBuilder('stripeCharge')
      .select('SUM(stripeCharge.amountCaptured)', 'count')
      .where('stripeCharge.createdAt > :thresholdDate', { thresholdDate })
      .getRawOne();

    return {
      count: Number(count.count) ?? 0,
    };
  }

  calculateBillSummary(
    price: number,
    investmentPropertiesCount: number,
    discountPercent: number,
    stripeFeesPercent: number,
    paymentMethod: string,
  ) {
    const quitClaimPrice =
      investmentPropertiesCount > 0 ? investmentPropertiesCount * 100 : 0;
    const subTotal = quitClaimPrice + price;
    const promoDiscount = subTotal * (discountPercent / 100);
    const promoDiscountedTotal = subTotal - promoDiscount;

    const otherFees = (stripeFeesPercent / 100) * promoDiscountedTotal;

    const amountPaid = promoDiscountedTotal + otherFees;

    return {
      investmentPropertiesTotalPrice: quitClaimPrice,
      promoCodeDiscount: promoDiscount,
      discountedTotal: promoDiscountedTotal,
      totalBill: subTotal,
      stripeFeesPercent,
      otherFees,
      amountPaid,
      paymentMethod,
    };
  }

  async createMany(data: Array<StripeWebhook>): Promise<Array<StripeWebhook>> {
    const persistenceModels = data.map((x) =>
      StripeWebhookMapper.toPersistence(x),
    );
    const newEntities = await this.stripeWebhookRepository.save(
      this.stripeWebhookRepository.create(persistenceModels),
    );
    return newEntities.map((x) => StripeWebhookMapper.toDomain(x));
  }

  async deleteMany(ids: Array<StripeWebhook['id']>): Promise<boolean> {
    await this.stripeWebhookRepository.delete(ids);
    return true;
  }
}
