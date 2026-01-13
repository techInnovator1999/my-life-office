import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsEnum,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Contact } from '../domain/contact';
import { ContactType, ContactStatus } from '../contacts.enum';
import { plainToInstance, Transform, Type } from 'class-transformer';

export class SortContactDto {
  @ApiProperty()
  @IsString()
  orderBy: keyof Contact;

  @ApiProperty()
  @IsString()
  order: string;
}

export class FilterContactDto {
  @IsOptional()
  @IsUUID()
  agentId?: string;

  @IsOptional()
  @IsEnum(ContactType)
  contactType?: ContactType;

  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;

  @IsOptional()
  @IsBoolean()
  isLocked?: boolean;

  @IsOptional()
  @IsBoolean()
  isFromGoogle?: boolean;

  @IsOptional()
  @IsString()
  search?: string; // For searching by name, email, etc.
}

export class QueryContactDto {
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

  @ApiProperty({ type: FilterContactDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterContactDto)
  filters?: FilterContactDto | null;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortContactDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortContactDto)
  sort?: SortContactDto[] | null;
}

