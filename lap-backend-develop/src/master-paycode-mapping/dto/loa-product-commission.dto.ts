import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class LOAProductCommissionDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Product ID for which commission applies',
  })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'Commission value for the product (must be >= 0)',
  })
  @IsNumber()
  @Min(0)
  commission: number;
}
