import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  IsNumber,
  IsDate,
} from 'class-validator';
import {
  ProductRatingEnum,
  ProductRealEnum,
  ProductTierEnum,
} from '../products.enum';

export class ProductDto {
  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  quantity?: string | null;

  @ApiProperty()
  @IsUUID()
  carrierId: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  serviceSubTypeId?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsUUID()
  @IsOptional()
  depositTypeId?: string | null;

  @ApiProperty({ type: [Object], required: false }) // Replace Object with ProductCommissionDto if you have it
  @IsOptional()
  productCommissions?: any[];

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  stateAvaiable?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  subName?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  productFullName?: string | null;

  @ApiProperty({ type: [String], nullable: true })
  @IsOptional()
  @IsArray()
  lengths: string[] | null;

  @ApiProperty()
  @IsString()
  serviceMainType: string;

  @ApiProperty({ enum: ProductRealEnum, required: false, nullable: true })
  @IsOptional()
  @IsEnum(ProductRealEnum)
  productReal?: ProductRealEnum | null;

  @ApiProperty({ enum: ProductTierEnum, required: false, nullable: true })
  @IsOptional()
  @IsEnum(ProductTierEnum)
  tier?: ProductTierEnum | null;

  @ApiProperty({ enum: ProductRatingEnum, required: false, nullable: true })
  @IsOptional()
  @IsEnum(ProductRatingEnum)
  rating?: ProductRatingEnum | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsNumber()
  orderNo?: number | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsDate()
  updatedAt?: Date | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsDate()
  deletedAt?: Date | null;
}
