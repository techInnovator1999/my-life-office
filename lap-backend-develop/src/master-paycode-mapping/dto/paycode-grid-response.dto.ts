import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  productFullName: string;
}

export class ProductCommissionResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  commission: number;

  @Expose()
  @ApiProperty({ type: ProductResponseDto })
  @Type(() => ProductResponseDto)
  product: ProductResponseDto;
}

export class PaycodeResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  type: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty({ type: [ProductCommissionResponseDto] })
  @Type(() => ProductCommissionResponseDto)
  productCommissions: ProductCommissionResponseDto[];
}

class CompanyMasterPaycodeResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  value: string;
}
export class MasterPaycodeResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  serial: number;

  @Expose()
  @ApiProperty()
  percentage: string;

  @Expose()
  @ApiProperty({ type: CompanyMasterPaycodeResponseDto })
  @Type(() => CompanyMasterPaycodeResponseDto)
  companyMasterPaycode: CompanyMasterPaycodeResponseDto;
}

export class PaycodeGridResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty({ type: MasterPaycodeResponseDto })
  @Type(() => MasterPaycodeResponseDto)
  masterPaycode: MasterPaycodeResponseDto;

  @Expose()
  @ApiProperty({ type: PaycodeResponseDto })
  @Type(() => PaycodeResponseDto)
  paycode: PaycodeResponseDto;
}
