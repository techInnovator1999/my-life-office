import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { DepositType } from '../domain/deposit-type';
import { plainToInstance, Transform, Type } from 'class-transformer';

export class SortDepositTypeDto {
  @ApiProperty()
  @IsString()
  orderBy: keyof DepositType;

  @ApiProperty()
  @IsString()
  order: string;
}

export class FilterDepositTypeDto {
  @IsOptional()
  @IsUUID()
  serviceMainId?: string;
}

export class QueryDepositTypeDto {
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

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterDepositTypeDto)
  // @Transform(({ value }) =>
  //   value ? plainToInstance(FilterDepositTypeDto, JSON.parse(value)) : null,
  // )
  filters?: FilterDepositTypeDto | null;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortDepositTypeDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortDepositTypeDto)
  sort?: SortDepositTypeDto[] | null;
}
