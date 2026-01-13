import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Paycode } from '../domain/paycode';
import { Type, plainToInstance, Transform } from 'class-transformer';

export class SortPaycodeDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  field: keyof Paycode;

  @ApiProperty({ type: String, required: true })
  @IsString()
  order: 'asc' | 'desc';
}

export class FilterPaycodeDto {
  @ApiProperty({ type: String, required: false })
  @IsString()
  name?: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  carrierId?: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  commissionLevelId?: string;
}

export class QueryPaycodeDto {
  @ApiProperty({ type: FilterPaycodeDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterPaycodeDto)
  filterOptions?: FilterPaycodeDto;

  @ApiProperty({
    required: false,
    type: [FilterPaycodeDto],
    description:
      'JSON stringified array of sort objects: [{ "orderBy": "name", "order": "asc" }]',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SortPaycodeDto)
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortPaycodeDto, JSON.parse(value))
      : undefined;
  })
  sort?: SortPaycodeDto[] | null;

  @ApiProperty({ type: Number, required: true })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  page: number;

  @ApiProperty({ type: Number, required: true })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  limit: number;
}
