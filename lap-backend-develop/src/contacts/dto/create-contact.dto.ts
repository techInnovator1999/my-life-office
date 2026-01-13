import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
  IsArray,
} from 'class-validator';
import { ContactType, ContactStatus } from '../contacts.enum';

export class CreateContactDto {
  @ApiProperty({ enum: ContactType, default: ContactType.INDIVIDUAL })
  @IsEnum(ContactType)
  @IsOptional()
  contactType?: ContactType;

  // Common fields for Individual and Employee
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string | null;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phoneNumber?: string | null; // Mobile

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  workPhone?: string | null; // Work phone

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date | null;

  // Address information
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  primaryAddress?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  zipCode?: string | null;

  // Individual/Employee specific fields
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  occupation?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  employer?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  spouse?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ssn?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mbiNumber?: string | null;

  // Business specific fields
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  companyName?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  industryType?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ownerName?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ownerTitle?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  ownerEmail?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ownerPhone?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  otherName?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  otherTitle?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  otherEmail?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  otherPhone?: string | null;

  // Employee specific fields
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  parentCompany?: string | null;

  // Common notes field
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string | null;

  // Source and referral
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  source?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  referredBy?: string | null;

  @ApiProperty({ enum: ContactStatus, default: ContactStatus.PROSPECT })
  @IsEnum(ContactStatus)
  @IsOptional()
  status?: ContactStatus;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isLocked?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isFromGoogle?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  googleContactId?: string | null;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  googleTags?: string[];

  @ApiProperty()
  @IsUUID()
  agentId: string;
}

