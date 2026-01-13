// import { Carrier } from "@/carriers/domain/carrier";

// export class FindAllCarrierdto extends Carrier {}
import { ApiProperty } from '@nestjs/swagger';
import { CarrierLevelEnum, CarrierRatingEnum } from '../carriers.enum';
import { ServiceMain } from '@/services/domain/service-main';
import { Broker } from '@/brokers/domain/broker';
import { Paycode } from '@/paycodes/domain/paycode';
import { Product } from '@/products/domain/product';

export class FindAllCarrierDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  city?: string | null;

  @ApiProperty({ required: false })
  state?: string | null;

  @ApiProperty({ required: false })
  zip?: string | null;

  @ApiProperty({ type: () => ServiceMain })
  serviceMain: ServiceMain;

  @ApiProperty()
  serviceId?: string;

  @ApiProperty({ type: () => [Paycode], required: false })
  paycodes?: Paycode[];

  @ApiProperty({ type: () => [Product], required: false })
  products?: Product[];

  @ApiProperty({ type: () => Broker, required: false })
  broker?: Broker | null;

  @ApiProperty({ required: false })
  fullName?: string | null;

  @ApiProperty()
  shortName: string;

  @ApiProperty({ required: false })
  initial?: string | null;

  @ApiProperty({ required: false })
  logo?: string | null;

  @ApiProperty()
  mainAddress: string;

  @ApiProperty({ required: false })
  mainPhone?: string | null;

  @ApiProperty({ required: false })
  agentSupportPhone?: string | null;

  @ApiProperty({ required: false })
  publicUrl?: string | null;

  @ApiProperty({ required: false })
  agentUrl?: string | null;

  @ApiProperty({ required: false })
  contactNotes: string | null;

  @ApiProperty({ required: false })
  emailCommission?: string | null;

  @ApiProperty({ required: false })
  emailNewBusiness?: string | null;

  @ApiProperty({ required: false })
  adminCutoff?: string | null;

  @ApiProperty({ required: false })
  adminReleaseDate?: string | null;

  @ApiProperty({ required: false })
  adminMinck?: string | null;

  @ApiProperty({ required: false })
  adminMineft?: string | null;

  @ApiProperty({ required: false })
  adminCommissionPolicy?: string | null;

  @ApiProperty({ required: false })
  adminChargebackSchedule?: string | null;

  @ApiProperty({ required: false })
  adminAdvanceCap?: string | null;

  @ApiProperty({ required: false })
  adminCommContact?: string | null;

  @ApiProperty({ required: false })
  adminOtherNotes?: string | null;

  @ApiProperty({ enum: CarrierLevelEnum, required: false })
  level?: CarrierLevelEnum | null;

  @ApiProperty({ enum: CarrierRatingEnum, required: false })
  rating?: CarrierRatingEnum | null;
}
