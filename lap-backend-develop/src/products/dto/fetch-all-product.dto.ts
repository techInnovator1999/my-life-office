import { ApiProperty } from '@nestjs/swagger';

export class ProductCommissionResponseDto {
  @ApiProperty()
  productCommissionId: string;

  @ApiProperty()
  name: string;

  // Add other relevant fields if needed
}

export class GetAllProductsDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  carrierId: string;

  @ApiProperty({ type: [ProductCommissionResponseDto] })
  productCommissions: ProductCommissionResponseDto[];
}
