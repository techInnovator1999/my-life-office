import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { ContactType, ContactStatus } from '../contacts.enum';
import { User } from '@/users/domain/user';

export class ContactDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  contactType: ContactType;
  
  // Common fields for Individual and Employee
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  phoneNumber?: string | null; // Mobile
  workPhone?: string | null; // Work phone
  dateOfBirth?: Date | null;
  
  // Address information
  primaryAddress?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  
  // Individual/Employee specific fields
  occupation?: string | null;
  employer?: string | null;
  spouse?: string | null;
  ssn?: string | null;
  mbiNumber?: string | null;
  
  // Business specific fields
  companyName?: string | null;
  industryType?: string | null;
  ownerName?: string | null;
  ownerTitle?: string | null;
  ownerEmail?: string | null;
  ownerPhone?: string | null;
  otherName?: string | null;
  otherTitle?: string | null;
  otherEmail?: string | null;
  otherPhone?: string | null;
  
  // Employee specific fields
  parentCompany?: string | null;
  
  // Common notes field
  notes?: string | null;
  
  // Source and referral
  source?: string | null;
  referredBy?: string | null;
  
  status: ContactStatus;
  isLocked: boolean;
  lockedAt?: Date | null;
  lockedBy?: string | null;
  isFromGoogle: boolean;
  googleContactId?: string | null;
  googleTags: string[];
  lastSyncedAt?: Date | null;
  agentId: string;
  agent?: User;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

