import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { Carrier } from '../domain/carrier';
import { CarrierLevelEnum, CarrierRatingEnum } from '../carriers.enum';
import { ServiceMain } from '@/services/domain/service-main';
import { Broker } from '@/brokers/domain/broker';
import { Paycode } from '@/paycodes/domain/paycode';
import { Product } from '@/products/domain/product';

export class CarrierDto implements Carrier {
  @ApiProperty()
  @IsUUID()
  id: string;

  serviceMain: ServiceMain;
  broker: Broker;
  paycodes: Paycode[];
  products: Product[];
  city?: string | null | undefined;
  state?: string | null | undefined;
  zip?: string | null | undefined;
  fullName?: string | null | undefined;
  shortName: string;
  initial?: string | null;
  logo?: string | null;
  mainAddress: string;
  mainPhone?: string;
  contactNotes: string | null;
  agentSupportPhone?: string;
  publicUrl?: string;
  agentUrl?: string;
  emailCommission?: string;
  emailNewBusiness?: string;
  adminCutoff?: string;
  adminReleaseDate?: string;
  adminMinck?: string;
  adminMineft?: string;
  adminCommissionPolicy?: string;
  adminChargebackSchedule?: string;
  adminAdvanceCap?: string;
  adminCommContact?: string;
  adminOtherNotes?: string;
  level: CarrierLevelEnum;
  rating: CarrierRatingEnum;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
