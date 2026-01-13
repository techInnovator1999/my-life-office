import { ContactEntity } from '../entities/contact.entity';
import { Contact } from '@/contacts/domain/contact';
import { FindAllContactDto } from '@/contacts/dto/find-all-contact.dto';
import { UserMapper } from '@/users/infrastructure/persistence/relational/mappers/user.mapper';
import { UserEntity } from '@/users/infrastructure/persistence/relational/entities/user.entity';
import { refById } from '@/utils/mapping.helper';

export class ContactMapper {
  static toDomain(entity: ContactEntity): Contact {
    const domain = new Contact();

    domain.id = entity.id;
    domain.contactType = entity.contactType;
    
    // Common fields for Individual and Employee
    domain.firstName = entity.firstName;
    domain.lastName = entity.lastName;
    domain.email = entity.email;
    domain.phoneNumber = entity.phoneNumber;
    domain.workPhone = entity.workPhone;
    domain.dateOfBirth = entity.dateOfBirth;
    
    // Address information
    domain.primaryAddress = entity.primaryAddress;
    domain.city = entity.city;
    domain.state = entity.state;
    domain.zipCode = entity.zipCode;
    
    // Individual/Employee specific fields
    domain.occupation = entity.occupation;
    domain.employer = entity.employer;
    domain.spouse = entity.spouse;
    domain.ssn = entity.ssn;
    domain.mbiNumber = entity.mbiNumber;
    
    // Business specific fields
    domain.companyName = entity.companyName;
    domain.industryType = entity.industryType;
    domain.ownerName = entity.ownerName;
    domain.ownerTitle = entity.ownerTitle;
    domain.ownerEmail = entity.ownerEmail;
    domain.ownerPhone = entity.ownerPhone;
    domain.otherName = entity.otherName;
    domain.otherTitle = entity.otherTitle;
    domain.otherEmail = entity.otherEmail;
    domain.otherPhone = entity.otherPhone;
    
    // Employee specific fields
    domain.parentCompany = entity.parentCompany;
    
    // Common notes field
    domain.notes = entity.notes;
    
    // Source and referral
    domain.source = entity.source;
    domain.referredBy = entity.referredBy;
    
    domain.status = entity.status;
    domain.isLocked = entity.isLocked;
    domain.lockedAt = entity.lockedAt;
    domain.lockedBy = entity.lockedBy;
    domain.isFromGoogle = entity.isFromGoogle;
    domain.googleContactId = entity.googleContactId;
    domain.googleTags = entity.googleTags || [];
    domain.lastSyncedAt = entity.lastSyncedAt;
    domain.agentId = entity.agentId;

    if (entity.agent) {
      domain.agent = UserMapper.toDomain(entity.agent);
    }

    domain.createdAt = entity.createdAt;
    domain.updatedAt = entity.updatedAt;
    domain.deletedAt = entity.deletedAt;

    return domain;
  }

  static toDomainMany(entity: ContactEntity): FindAllContactDto {
    const domain = new FindAllContactDto();

    domain.id = entity.id;
    domain.contactType = entity.contactType;
    
    // Common fields for Individual and Employee
    domain.firstName = entity.firstName;
    domain.lastName = entity.lastName;
    domain.email = entity.email;
    domain.phoneNumber = entity.phoneNumber;
    domain.workPhone = entity.workPhone;
    domain.dateOfBirth = entity.dateOfBirth;
    
    // Address information
    domain.primaryAddress = entity.primaryAddress;
    domain.city = entity.city;
    domain.state = entity.state;
    domain.zipCode = entity.zipCode;
    
    // Individual/Employee specific fields
    domain.occupation = entity.occupation;
    domain.employer = entity.employer;
    domain.spouse = entity.spouse;
    domain.ssn = entity.ssn;
    domain.mbiNumber = entity.mbiNumber;
    
    // Business specific fields
    domain.companyName = entity.companyName;
    domain.industryType = entity.industryType;
    domain.ownerName = entity.ownerName;
    domain.ownerTitle = entity.ownerTitle;
    domain.ownerEmail = entity.ownerEmail;
    domain.ownerPhone = entity.ownerPhone;
    domain.otherName = entity.otherName;
    domain.otherTitle = entity.otherTitle;
    domain.otherEmail = entity.otherEmail;
    domain.otherPhone = entity.otherPhone;
    
    // Employee specific fields
    domain.parentCompany = entity.parentCompany;
    
    // Common notes field
    domain.notes = entity.notes;
    
    // Source and referral
    domain.source = entity.source;
    domain.referredBy = entity.referredBy;
    
    domain.status = entity.status;
    domain.isLocked = entity.isLocked;
    domain.lockedAt = entity.lockedAt;
    domain.lockedBy = entity.lockedBy;
    domain.isFromGoogle = entity.isFromGoogle;
    domain.googleContactId = entity.googleContactId;
    domain.googleTags = entity.googleTags || [];
    domain.lastSyncedAt = entity.lastSyncedAt;
    domain.agentId = entity.agentId;

    if (entity.agent) {
      domain.agent = UserMapper.toDomain(entity.agent);
    }

    return domain;
  }

  static toPersistence(domain: Contact): ContactEntity {
    const entity = new ContactEntity();

    entity.id = domain.id;
    entity.contactType = domain.contactType;
    
    // Common fields for Individual and Employee
    entity.firstName = domain.firstName;
    entity.lastName = domain.lastName;
    entity.email = domain.email;
    entity.phoneNumber = domain.phoneNumber;
    entity.workPhone = domain.workPhone;
    entity.dateOfBirth = domain.dateOfBirth;
    
    // Address information
    entity.primaryAddress = domain.primaryAddress;
    entity.city = domain.city;
    entity.state = domain.state;
    entity.zipCode = domain.zipCode;
    
    // Individual/Employee specific fields
    entity.occupation = domain.occupation;
    entity.employer = domain.employer;
    entity.spouse = domain.spouse;
    entity.ssn = domain.ssn;
    entity.mbiNumber = domain.mbiNumber;
    
    // Business specific fields
    entity.companyName = domain.companyName;
    entity.industryType = domain.industryType;
    entity.ownerName = domain.ownerName;
    entity.ownerTitle = domain.ownerTitle;
    entity.ownerEmail = domain.ownerEmail;
    entity.ownerPhone = domain.ownerPhone;
    entity.otherName = domain.otherName;
    entity.otherTitle = domain.otherTitle;
    entity.otherEmail = domain.otherEmail;
    entity.otherPhone = domain.otherPhone;
    
    // Employee specific fields
    entity.parentCompany = domain.parentCompany;
    
    // Common notes field
    entity.notes = domain.notes;
    
    // Source and referral
    entity.source = domain.source;
    entity.referredBy = domain.referredBy;
    
    entity.status = domain.status;
    entity.isLocked = domain.isLocked;
    entity.lockedAt = domain.lockedAt;
    entity.lockedBy = domain.lockedBy;
    entity.isFromGoogle = domain.isFromGoogle;
    entity.googleContactId = domain.googleContactId;
    entity.googleTags = domain.googleTags || [];
    entity.lastSyncedAt = domain.lastSyncedAt;
    entity.agentId = domain.agentId;

    if (domain.agentId) {
      entity.agent = refById<UserEntity>(domain.agentId);
    }

    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.deletedAt = domain.deletedAt;

    return entity;
  }
}

