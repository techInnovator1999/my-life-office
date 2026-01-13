import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { Plan } from '../domain/plan';

export class FilterPlanDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @ValidateNested({ each: true })
  name?: string[] | null;
}

export class SortPlanDto {
  @ApiProperty()
  @IsString()
  orderBy: keyof Plan;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryPlanDto {
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

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(FilterPlanDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterPlanDto)
  filters?: FilterPlanDto | null;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    return value ? plainToInstance(SortPlanDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortPlanDto)
  sort?: SortPlanDto[] | null;
}
