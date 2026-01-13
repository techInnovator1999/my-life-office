import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@/config/config.type';
import { DataSource, Repository } from 'typeorm';
import { StripeWebhook } from './domain/stripe';
import { WebhookEvents } from './stripe.enum';
import { StripeWebhookEntity } from './persistence/relational/entities/stripe.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StripeChargeEntity } from './persistence/relational/entities/stripe-charge.entity';
import { StripeWebhookRepository } from './persistence/stripe.repository';
import { PlanRepository } from '@/plan/persistence/plan.repository';
import { MailService } from '@/mail/mail.service';
import { PushNotificationService } from '@/notification/push.notification.service';
import { PaymentStatsDto } from './dto/payment-stats.dto';
import moment from 'moment-timezone';
import { handleTransaction } from '@/utils/dbTransactions';
import { SortStripeChargeDto } from './dto/query-stripe.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { StripePaymentDto } from './dto/stripe-payment.dto';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(
    private readonly stripeRelationalWebhookRepository: StripeWebhookRepository,
    private readonly configService: ConfigService<AllConfigType>,
    @InjectRepository(StripeWebhookEntity)
    private readonly stripeWebhookRepository: Repository<StripeWebhookEntity>,
    @InjectRepository(StripeChargeEntity)
    private readonly stripeChargeRepository: Repository<StripeChargeEntity>,
    private dataSource: DataSource,
    private readonly planRepository: PlanRepository,
    private mailService: MailService,
    private pushNotificationService: PushNotificationService,
  ) {
    this.stripe = new Stripe(
      configService.getOrThrow('stripe.stripeSecretKey', { infer: true }),
      {
        apiVersion: configService.getOrThrow('stripe.stripeApiVersion', {
          infer: true,
        }),
      },
    );
  }

  async countEarningCurrentWeek(): Promise<{ count: number }> {
    return this.stripeRelationalWebhookRepository.countEarningCurrentWeek();
  }

  async getAllStripeCharges(): Promise<StripeChargeEntity[]> {
    return this.stripeChargeRepository.find();
  }

  async retrievePaymentDetails(): Promise<{ totalAmount: any }> {
    const total =
      (await this.stripeRelationalWebhookRepository.retrievePaymentDetails()) ||
      0;
    const result = { totalAmount: total };
    return result;
  }

  async getPaymentStats(): Promise<PaymentStatsDto> {
    const subQueryTotalRevenue = this.stripeChargeRepository
      .createQueryBuilder('sce')
      .select('COALESCE(SUM(sce.amountCaptured), 0)', 'totalRevenue');

    const subQueryPaidPayments = this.stripeChargeRepository
      .createQueryBuilder('sce')
      .select('COALESCE(COUNT(sce.id), 0)', 'paidPayments')
      .where('sce.status = :status', { status: 'succeeded' });

    const subQueryRefundedPayments = this.stripeChargeRepository
      .createQueryBuilder('sce')
      .select('COALESCE(COUNT(sce.id), 0)', 'refundedPayments')
      .where('sce.status = :status', { status: 'failed' });

    const query = this.stripeChargeRepository
      .createQueryBuilder()
      .select(`(${subQueryTotalRevenue.getQuery()}) as "totalRevenue"`)
      .addSelect(`(${subQueryPaidPayments.getQuery()}) as "paidPayments"`)
      .addSelect(
        `(${subQueryRefundedPayments.getQuery()})`,
        'refundedPayments',
      );

    const result = (await query.getRawOne()) as PaymentStatsDto;

    return result;
  }

  async getLastMonthPayments(): Promise<[StripeChargeEntity[], number]> {
    const curMoment = moment();
    const thirtyDaysAgo = curMoment.subtract(30, 'days').toDate();

    const query = this.stripeChargeRepository
      .createQueryBuilder('sc')
      .where('sc.status = :status', { status: 'succeeded' })
      .andWhere('sc."createdAt" >= :thirtyDaysAgo', { thirtyDaysAgo });

    const result = await query.getManyAndCount();

    return result;
  }

  async create(
    total: number,
    promo_code: string,
    userId: string,
  ): Promise<any> {
    // fetch user email and name
    console.log(userId);
    const { email, name } = {
      email: 'fake_email',
      name: 'fake_name',
    };

    return await handleTransaction(this.dataSource, async () => {
      const paymentIntent = await this.createPaymentIntent(
        total,
        'usd',
        email,
        name,
        promo_code,
      );
      return {
        clientSecret: paymentIntent.client_secret,
        price: total,
      };
    });
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    email: string,
    name: string,
    metadata: any,
  ) {
    const customer = await this.createCustomer(email, name);

    return await this.stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      customer: customer.id,
      description: metadata.description || 'Payment for services',
      automatic_payment_methods: {
        enabled: false,
      },
      payment_method_types: ['card', 'us_bank_account'],
      metadata: metadata,
    });
  }

  public async handleMyAccountEventWebhook(
    requestBody: any,
    signature: string,
  ) {
    const webhookSecret = this.configService.getOrThrow(
      'stripe.stripeWebhookSecretKey',
      { infer: true },
    );
    await this.webhookEventHandler(requestBody, signature, webhookSecret);
  }

  async findManyWithPagination(
    {
      // sortOptions,
      // paginationOptions,
    }: {
      sortOptions?: SortStripeChargeDto[] | null;
      paginationOptions: IPaginationOptions;
    },
  ): Promise<{ total: number; data: StripePaymentDto[] }> {
    // return await this.stripeRelationalWebhookRepository.findManyWithPagination({
    //   sortOptions,
    //   paginationOptions,
    // });
    return new Promise((resolve) => {
      resolve({ total: 0, data: [] });
    });
  }

  private constructWebhookEvent(
    data: string,
    signature: string,
    webhookSecret: string,
  ) {
    return this.stripe.webhooks.constructEvent(data, signature, webhookSecret);
  }

  private async webhookEventHandler(
    requestBody: any,
    signature: string,
    webhookSecret: string,
  ): Promise<void> {
    const event = await this.constructWebhookEvent(
      requestBody,
      signature,
      webhookSecret,
    );
    const stripeWebhook = this.stripeWebhookRepository.create({
      payload: JSON.parse(requestBody),
      type: event.type as WebhookEvents,
      isDequeued: false,
      isSuccess: false,
    });
    await this.stripeWebhookRepository.save(stripeWebhook);
    await this.handleWebhookEvent(stripeWebhook);
  }

  public async handleWebhookEvent(stripeWebhook: StripeWebhook) {
    try {
      switch (stripeWebhook.type) {
        case WebhookEvents.PaymentIntentCreated:
          await this.handlePaymentIntentCreatedEvent(stripeWebhook);
          break;
        case WebhookEvents.ChargeSucceeded:
          await this.handleChargeSucceededEvent(stripeWebhook);
          break;
        case WebhookEvents.ChargeFailed:
          await this.handleChargeFailedEvent(stripeWebhook);
          break;
        case WebhookEvents.ChargePending:
          await this.handleChargePendingEvent(stripeWebhook);
          break;
        default:
          break;
      }

      await this.stripeWebhookRepository.update(stripeWebhook.id, {
        isDequeued: true,
        isSuccess: true,
      });
    } catch (error) {
      await this.stripeWebhookRepository.update(stripeWebhook.id, {
        isDequeued: true,
        isSuccess: false,
        exception: error.message,
      });
      throw error;
    }
  }

  private handlePaymentIntentCreatedEvent(stripeWebhook: StripeWebhook) {
    const event = stripeWebhook.payload as Stripe.PaymentIntentCreatedEvent;
    const data = event.data.object;
    console.log('Payment Intent Created:', data.id);
    // Store payment intent information if needed
  }

  private async handleChargeFailedEvent(stripeWebhook: StripeWebhook) {
    const event = stripeWebhook.payload as
      | Stripe.ChargeFailedEvent
      | Stripe.PaymentIntentPaymentFailedEvent;
    const data = event.data.object;

    // Record the failed charge
    console.log('Charge Failed:', data.id);

    // Wait for 1 second
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));

    // Send notification email about failed payment
  }

  private async handleChargeSucceededEvent(stripeWebhook: StripeWebhook) {
    const event = stripeWebhook.payload as Stripe.ChargeSucceededEvent;
    const data = event.data.object;

    // Save the charge information
    const stripeChargeObj = {
      chargeId: data.id,
      cart: data.metadata?.cartId ? { id: data.metadata.cartId } : null,
      status: data.status,
      amountCaptured: data.amount_captured ? data.amount_captured / 100 : 0,
      description: data.metadata?.description || data.description || '-',
      customer: data.billing_details?.email || data.metadata?.customer_email,
    };

    await this.stripeChargeRepository.save(stripeChargeObj);

    // Process successful payment
    console.log('Charge Succeeded:', data.id);

    // Send success notification

    // Send payment confirmation email
  }

  private async handleChargePendingEvent(stripeWebhook: StripeWebhook) {
    const event = stripeWebhook.payload as Stripe.ChargePendingEvent;
    const data = event.data.object;

    // Handle pending charges (like ACH transfers)
    if (
      data?.payment_method_details?.type === 'us_bank_account' &&
      data.billing_details?.email
    ) {
      // Wait for 1 second
      await new Promise<void>((resolve) => setTimeout(resolve, 1000));

      // Notify customer about pending bank transfer
      // Notify admin about pending bank transfer
    }
  }

  private async createCustomer(
    email: string,
    name: string,
  ): Promise<Stripe.Response<Stripe.Customer>> {
    return await this.stripe.customers.create({
      email: email,
      name: name,
    });
  }
}
