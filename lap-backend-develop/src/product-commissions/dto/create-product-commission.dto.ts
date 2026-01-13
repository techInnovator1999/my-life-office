// create-product-commission.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsUUID, ValidateNested } from 'class-validator';

export class ProductRefDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class PaycodeRefDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class CreateProductCommissionDto {
  @ApiProperty({ type: ProductRefDto })
  @ValidateNested()
  @Type(() => ProductRefDto)
  product: ProductRefDto;

  @ApiProperty({ type: PaycodeRefDto })
  @ValidateNested()
  @Type(() => PaycodeRefDto)
  paycode: PaycodeRefDto;

  @ApiProperty({ type: Number, default: 0, required: false })
  @IsOptional()
  commission: number;
}
