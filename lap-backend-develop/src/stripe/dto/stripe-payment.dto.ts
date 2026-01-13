import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class StripePaymentDto<T = any> {
  @ApiProperty({ type: Number, description: 'Amount captured in the payment' })
  @IsNumber()
  @IsNotEmpty()
  amount_captured: number;

  @ApiProperty({ type: String, description: 'Description of the payment' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: String, description: 'Customer identifier or email' })
  @IsString()
  @IsNotEmpty()
  customer: string;

  @ApiProperty({ type: String, description: 'Promotion code if applicable' })
  @IsString()
  @IsOptional()
  promo_code?: string;

  @ApiProperty({
    description: 'Additional metadata for the payment',
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  metadata?: T;

  @ApiProperty({ type: String, description: 'Order ID reference' })
  @IsString()
  @IsOptional()
  orderId?: string;

  @ApiProperty({ type: Number })
  orderNumber?: number | null;

  @ApiProperty({ type: String })
  status?: string | null;

  @ApiProperty({ type: String })
  stripeId?: string | null;

  @ApiProperty({ type: String })
  userId?: string | null;

  @ApiProperty({ type: Number })
  receivedAmount?: number | null;

  @ApiProperty({ type: Date })
  chargeInitiatedDate?: Date | null;

  @ApiProperty({ type: String })
  otherCharges?: string | null;

  @ApiProperty({ type: String })
  paymentMethod?: string;
}
