// dto/create-carrier.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { CarrierLevelEnum, CarrierRatingEnum } from '../carriers.enum';

export class CreateCarrierDto {
  @ApiProperty({ type: String })
  @IsUUID()
  serviceMainId: string;

  @ApiProperty({ type: String })
  @IsUUID()
  brokerId: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  serviceId?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Array of paycode names',
  })
  @IsOptional()
  @IsString({ each: true })
  paycodeName: string[];

  @ApiPropertyOptional({ type: [String], description: 'Array of product IDs' })
  @IsOptional()
  @IsUUID('all', { each: true })
  productIds: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  zip?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fullName?: string | null;

  @ApiProperty()
  @IsString()
  shortName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  initial?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logo?: string | null;

  @ApiProperty()
  @IsString()
  mainAddress: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber()
  mainPhone?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber()
  agentSupportPhone?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  publicUrl?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  agentUrl?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactNotes: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  emailCommission?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  emailNewBusiness?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  adminCutoff?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  adminReleaseDate?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  adminMinck?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  adminMineft?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  adminCommissionPolicy?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  adminChargebackSchedule?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  adminAdvanceCap?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  adminCommContact?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  adminOtherNotes?: string | null;

  @ApiProperty({ enum: CarrierLevelEnum })
  @IsEnum(CarrierLevelEnum)
  level: CarrierLevelEnum;

  @ApiProperty({ enum: CarrierRatingEnum })
  @IsEnum(CarrierRatingEnum)
  rating: CarrierRatingEnum;
}
