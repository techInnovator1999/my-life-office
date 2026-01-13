import { ApiProperty } from '@nestjs/swagger';
import { ContactType, ContactStatus } from '../contacts.enum';
import { User } from '@/users/domain/user';

export class FindAllContactDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: ContactType })
  contactType: ContactType;

  // Common fields for Individual and Employee
  @ApiProperty({ required: false })
  firstName?: string | null;

  @ApiProperty({ required: false })
  lastName?: string | null;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  phoneNumber?: string | null; // Mobile

  @ApiProperty({ required: false })
  workPhone?: string | null; // Work phone

  @ApiProperty({ required: false })
  dateOfBirth?: Date | null;

  // Address information
  @ApiProperty({ required: false })
  primaryAddress?: string | null;

  @ApiProperty({ required: false })
  city?: string | null;

  @ApiProperty({ required: false })
  state?: string | null;

  @ApiProperty({ required: false })
  zipCode?: string | null;

  // Individual/Employee specific fields
  @ApiProperty({ required: false })
  occupation?: string | null;

  @ApiProperty({ required: false })
  employer?: string | null;

  @ApiProperty({ required: false })
  spouse?: string | null;

  @ApiProperty({ required: false })
  ssn?: string | null;

  @ApiProperty({ required: false })
  mbiNumber?: string | null;

  // Business specific fields
  @ApiProperty({ required: false })
  companyName?: string | null;

  @ApiProperty({ required: false })
  industryType?: string | null;

  @ApiProperty({ required: false })
  ownerName?: string | null;

  @ApiProperty({ required: false })
  ownerTitle?: string | null;

  @ApiProperty({ required: false })
  ownerEmail?: string | null;

  @ApiProperty({ required: false })
  ownerPhone?: string | null;

  @ApiProperty({ required: false })
  otherName?: string | null;

  @ApiProperty({ required: false })
  otherTitle?: string | null;

  @ApiProperty({ required: false })
  otherEmail?: string | null;

  @ApiProperty({ required: false })
  otherPhone?: string | null;

  // Employee specific fields
  @ApiProperty({ required: false })
  parentCompany?: string | null;

  // Common notes field
  @ApiProperty({ required: false })
  notes?: string | null;

  // Source and referral
  @ApiProperty({ required: false })
  source?: string | null;

  @ApiProperty({ required: false })
  referredBy?: string | null;

  @ApiProperty({ enum: ContactStatus })
  status: ContactStatus;

  @ApiProperty()
  isLocked: boolean;

  @ApiProperty({ required: false })
  lockedAt?: Date | null;

  @ApiProperty({ required: false })
  lockedBy?: string | null;

  @ApiProperty()
  isFromGoogle: boolean;

  @ApiProperty({ required: false })
  googleContactId?: string | null;

  @ApiProperty({ type: [String], required: false })
  googleTags?: string[];

  @ApiProperty({ required: false })
  lastSyncedAt?: Date | null;

  @ApiProperty()
  agentId: string;

  @ApiProperty({ type: () => User, required: false })
  agent?: User;
}

