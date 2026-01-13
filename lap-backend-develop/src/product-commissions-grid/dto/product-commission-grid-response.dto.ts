import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CommissionDto {
  @ApiProperty({ type: String })
  @IsString()
  paycodeId: string;

  @ApiProperty({ type: String })
  @IsString()
  paycodeName: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  commission: number;
}

export class ProductCommissionResponseDto {
  @ApiProperty({ type: String })
  @IsString()
  productId: string;

  @ApiProperty({ type: String })
  @IsString()
  productName: string;

  @ApiProperty({ type: String })
  @IsString()
  carrierId: string;

  @ApiProperty({ type: [CommissionDto] })
  @ValidateNested({ each: true })
  @Type(() => CommissionDto)
  commissions: CommissionDto[];
}
