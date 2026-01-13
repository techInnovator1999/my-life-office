import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Broker } from '../domain/broker';
import { plainToInstance, Transform, Type } from 'class-transformer';

export class SortBrokerDto {
  @ApiProperty()
  @IsString()
  orderBy: keyof Broker;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryBrokerDto {
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

  @ApiProperty({ required: false })
  @IsOptional()
  filters?: Record<string, string> | null;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortBrokerDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortBrokerDto)
  sort?: SortBrokerDto[] | null;
}
