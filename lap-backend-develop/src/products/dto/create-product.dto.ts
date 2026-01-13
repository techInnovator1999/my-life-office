import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  ProductLength,
  ProductRatingEnum,
  ProductRealEnum,
  ProductTierEnum,
} from '../products.enum';
import { Type } from 'class-transformer';

class CommissionDto {
  @ApiProperty({ description: 'Paycode name' })
  @IsString()
  @IsNotEmpty()
  paycodeName: string;

  @ApiProperty({ description: 'Commission value', minimum: 0, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  commission: number = 0;
}
export class CreateProductDto {
  @ApiProperty({ description: 'Product name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Quantity of the product',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  quantity?: string | null;

  @ApiProperty({ description: 'Carrier ID (UUID)' })
  @IsUUID()
  carrierId: string;

  @ApiProperty({ description: 'Service Sub Type ID (UUID)' })
  @IsUUID()
  serviceSubTypeId: string;

  @ApiProperty({
    description: 'Deposit Type ID (UUID)',
  })
  @IsUUID()
  depositTypeId: string;

  // @ApiProperty({
  //   description: 'Product Commission IDs (UUIDs)',
  //   required: false,
  //   type: [String],
  // })
  // @IsOptional()
  // @IsUUID('all', { each: true })
  // productCommissions?: string[];

  @ApiProperty({
    description: 'State Available',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  stateAvailable?: string | null;

  @ApiProperty({
    description: 'Sub name of the product',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  subName?: string | null;

  @ApiProperty({
    description: 'Full product name',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  productFullName?: string | null;

  @ApiProperty({
    description: 'Criteria',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  criteria?: string | null;

  @ApiProperty({
    description: 'Notes',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  notes?: string | null;

  @ApiProperty({
    description: 'Lengths supported by the product',
    required: false,
    nullable: true,
  })
  @IsArray({})
  // @IsOptional()
  @IsString({ each: true })
  lengths: ProductLength[];

  @ApiProperty({
    description: 'Service Main Type ID (UUID)',
  })
  @IsString()
  serviceMainType: string;

  @ApiProperty({
    enum: ProductRealEnum,
    description: 'Product Real Enum',
  })
  // @IsOptional()
  @IsEnum(ProductRealEnum)
  productReal: ProductRealEnum;

  @ApiProperty({
    enum: ProductTierEnum,
    description: 'Product Tier',
  })
  @IsEnum(ProductTierEnum)
  tier: ProductTierEnum;

  @ApiProperty({
    enum: ProductRatingEnum,
    description: 'Product Rating',
  })
  @IsEnum(ProductRatingEnum)
  rating: ProductRatingEnum;

  @ApiProperty({
    description: 'Paycode commissions to be applied',
    type: [CommissionDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommissionDto)
  productCommissions: CommissionDto[];
}
