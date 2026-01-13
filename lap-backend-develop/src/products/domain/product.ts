import { Carrier } from '@/carriers/domain/carrier';
import { ServiceSubType } from '@/services/domain/service-sub-type';
import { ProductCommission } from '@/product-commissions/domain/product-commission';
import { DepositType } from '@/deposit-types/domain/deposit-type';
import {
  ProductLength,
  ProductRatingEnum,
  ProductRealEnum,
  ProductTierEnum,
} from '../products.enum';

export class Product {
  id: string;
  name: string;
  carrier: Carrier;
  serviceMainType: string;
  serviceSubType: ServiceSubType;
  depositType: DepositType;
  productCommissions: ProductCommission[];
  stateAvailable?: string | null;
  subName?: string | null;
  productFullName?: string | null;
  lengths: ProductLength[];
  productReal: ProductRealEnum;
  tier: ProductTierEnum;
  rating: ProductRatingEnum;
  orderNo: number;
  criteria?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
