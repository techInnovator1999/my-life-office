import { ApiProperty } from '@nestjs/swagger';
import { Type, plainToInstance, Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { ProductCommission } from '../domain/product-commission';

export class SortProductCommissionDto {
  @ApiProperty()
  @IsString()
  orderBy: keyof ProductCommission;

  @ApiProperty()
  @IsString()
  order: string;
}

export class FilterProductCommissionDto {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  name?: string;
}

export class QueryProductCommissionDto {
  @ApiProperty({
    required: false,
  })
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiProperty({
    required: false,
  })
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit: number;

  @ApiProperty({ required: false })
  @IsOptional()
  id?: string;

  @ApiProperty({ required: false, type: FilterProductCommissionDto })
  @ValidateNested()
  @Type(() => FilterProductCommissionDto)
  @IsOptional()
  filters?: FilterProductCommissionDto | null;

  @ApiProperty({
    required: false,
    type: [FilterProductCommissionDto],
    description:
      'JSON stringified array of sort objects: [{ "orderBy": "name", "order": "asc" }]',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SortProductCommissionDto)
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortProductCommissionDto, JSON.parse(value))
      : undefined;
  })
  sort?: SortProductCommissionDto[] | null;
}
