import { Carrier } from '@/carriers/domain/carrier';
import { ProductCommission } from '@/product-commissions/domain/product-commission';
import { PaycodeType } from '../paycodes.enum';

export class Paycode {
  id: string;
  // Use only foreign key references in the domain layer for relations
  carrier: Carrier;
  productCommissions?: ProductCommission[];
  type: PaycodeType;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
