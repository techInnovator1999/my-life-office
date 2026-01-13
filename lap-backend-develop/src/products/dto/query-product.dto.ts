import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../domain/product';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { plainToInstance, Type, Transform } from 'class-transformer';

export enum FilterProductEnum {
  'ACTIVE_PRODUCTS' = '1',
  'INACTIVE_PRODUCTS' = '2',
  'NAME' = '3',
  'SERVICE_MAIN_TYPE' = '4',
  'CARRIER_ID' = '5',
  'DEPOSIT_ID' = '6',
  'SERVICE_SUB_TYPE_ID' = '7',
}

export class SortProductDto {
  @ApiProperty()
  @IsString()
  orderBy: keyof Product;

  @ApiProperty()
  @IsString()
  order: string;
}

export class FilterProductDto {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsUUID()
  serviceMainId?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsUUID()
  carrierId?: string;
  // Note: Might add later if required.
  // @ApiProperty({ required: false })
  // @IsOptional()
  // filtersProducts?: FilterProductEnum;
}

export class QueryProductDto extends FilterProductDto {
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

  @ApiProperty({ required: false, type: FilterProductDto })
  @ValidateNested()
  @Type(() => FilterProductDto)
  @IsOptional()
  filters?: FilterProductDto | null;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortProductDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortProductDto)
  sort?: SortProductDto[] | null;
}
