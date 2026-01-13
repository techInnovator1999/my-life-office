// domain/product-commission.domain.ts
import { Paycode } from '@/paycodes/domain/paycode';
import { Product } from '@/products/domain/product';
import { ApiProperty } from '@nestjs/swagger';
export class ProductCommission {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Product })
  product: Product;

  @ApiProperty({ type: Paycode })
  paycode: Paycode;

  @ApiProperty({ type: Number, default: 0, required: false })
  commission: number;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
