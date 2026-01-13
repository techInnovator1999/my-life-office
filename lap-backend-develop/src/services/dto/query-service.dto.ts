import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance, Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginateDto } from '@/utils/dtos/paginate.dto';
import { ServiceMain } from '../domain/service-main';

export class SortServiceDto {
  @ApiProperty()
  @IsString()
  orderBy: keyof ServiceMain;

  @ApiProperty()
  @IsString()
  order: string;
}

export class FilterMainServiceDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  shortName?: string;
}

export class QueryServiceMainDto extends PaginateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  id?: string;

  @ApiProperty({ required: false, enum: [FilterMainServiceDto] })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterMainServiceDto)
  filters?: FilterMainServiceDto;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortServiceDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortServiceDto)
  sort?: SortServiceDto[] | null;
}

export class QueryServiceSubDto extends PaginateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  mainServiceId?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortServiceDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortServiceDto)
  sort?: SortServiceDto[] | null;
}
