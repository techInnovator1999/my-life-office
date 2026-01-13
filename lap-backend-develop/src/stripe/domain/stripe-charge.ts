import { ApiProperty } from '@nestjs/swagger';

export class StripeCharge {
  @ApiProperty()
  id: number;

  chargeId: string;

  status: string;

  @ApiProperty()
  amountCaptured: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  customer: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
