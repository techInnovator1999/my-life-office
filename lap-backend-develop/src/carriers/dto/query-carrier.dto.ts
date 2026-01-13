import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Carrier } from '../domain/carrier';
import { plainToInstance, Transform, Type } from 'class-transformer';

export class SortCarrierDto {
  @ApiProperty()
  @IsString()
  orderBy: keyof Carrier;

  @ApiProperty()
  @IsString()
  order: string;
}

export class FilterCarrierDto {
  @IsOptional()
  @IsUUID()
  serviceMainId?: string;

  @IsOptional()
  @IsUUID()
  productId?: string;
}

export class QueryCarrierDto {
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
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({ type: FilterCarrierDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterCarrierDto)
  filters?: FilterCarrierDto | null;

  @IsOptional()
  @IsUUID()
  serviceMainId?: string;

  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortCarrierDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortCarrierDto)
  sort?: SortCarrierDto[] | null;
}
