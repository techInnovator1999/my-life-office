// domain/carrier.domain.ts

import { ServiceMain } from '@/services/domain/service-main';
import { CarrierLevelEnum, CarrierRatingEnum } from '../carriers.enum';
import { Broker } from '@/brokers/domain/broker';
import { Paycode } from '@/paycodes/domain/paycode';
import { Product } from '@/products/domain/product';

export class Carrier {
  id: string;

  serviceMain: ServiceMain;
  broker: Broker;

  serviceId?: string | null;

  // Optional: if you want to include related resource IDs
  paycodes: Paycode[];
  products: Product[];

  city?: string | null;
  state?: string | null;
  zip?: string | null;

  fullName?: string | null;
  shortName: string;
  initial?: string | null;
  logo?: string | null;

  mainAddress: string;
  mainPhone?: string | null;
  agentSupportPhone?: string | null;
  contactNotes: string | null;

  publicUrl?: string | null;
  agentUrl?: string | null;

  emailCommission?: string | null;
  emailNewBusiness?: string | null;

  adminCutoff?: string | null;
  adminReleaseDate?: string | null;
  adminMinck?: string | null;
  adminMineft?: string | null;
  adminCommissionPolicy?: string | null;
  adminChargebackSchedule?: string | null;
  adminAdvanceCap?: string | null;
  adminCommContact?: string | null;
  adminOtherNotes?: string | null;

  level: CarrierLevelEnum;
  rating: CarrierRatingEnum;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
