import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { EmailTemplate } from '../domain/email-template';

export class SortEmailTemplateDto {
  @ApiProperty()
  @IsString()
  orderBy: keyof EmailTemplate;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryEmailTemplateDto {
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
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortEmailTemplateDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortEmailTemplateDto)
  sort?: SortEmailTemplateDto[] | null;
}
