import { Injectable } from '@nestjs/common';
import { ContactRepository } from './infrastructure/persistence/contact.repository';
import { Contact } from './domain/contact';
import { EntityCondition } from '@/utils/types/entity-condition.type';
import { NullableType } from '@/utils/types/nullable.type';
import { FilterContactDto, SortContactDto } from './dto/query-contact.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { FindAllContactDto } from './dto/find-all-contact.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactMapper } from './infrastructure/persistence/relational/mappers/contact.mapper';
import { ContactType, ContactStatus } from './contacts.enum';

@Injectable()
export class ContactsService {
  constructor(private readonly contactRepository: ContactRepository) {}

  async create(data: CreateContactDto): Promise<Contact> {
    const contact = this.mapDomainFromCreateDto(data);
    return this.contactRepository.create(contact);
  }

  async findAll(): Promise<FindAllContactDto[]> {
    return this.contactRepository.findMany({});
  }

  findOne(fields: EntityCondition<Contact>): Promise<NullableType<Contact>> {
    return this.contactRepository.findOne(fields);
  }

  findOneById(id: Contact['id']): Promise<NullableType<Contact>> {
    return this.contactRepository.findOneById(id).then((entity) => {
      return entity ? ContactMapper.toDomain(entity) : null;
    });
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterContactDto | null;
    sortOptions?: SortContactDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<{ total: number; data: FindAllContactDto[] }> {
    const { total, data } =
      await this.contactRepository.findManyWithPagination({
        filterOptions,
        sortOptions,
        paginationOptions,
      });

    const dtos = data.map((entity) => ContactMapper.toDomainMany(entity));

    return { total, data: dtos };
  }

  async update(
    id: Contact['id'],
    payload: UpdateContactDto,
  ): Promise<Contact | null> {
    const clonedPayload = { ...payload };
    return this.contactRepository.update(id, clonedPayload as Partial<Contact>);
  }

  async softDelete(id: Contact['id']): Promise<void> {
    await this.contactRepository.softDelete(id);
  }

  async hardDelete(id: Contact['id']): Promise<void> {
    const contact = await this.contactRepository.findOneById(id);
    if (!contact) {
      throw new Error(`Contact with id ${id} not found`);
    }

    await this.contactRepository.delete(id);
  }

  findOrFail(id: Contact['id']): Promise<Contact> {
    return this.contactRepository.findOrFail(id);
  }

  private mapDomainFromCreateDto(data: CreateContactDto): Contact {
    const contact = new Contact();

    contact.contactType = data.contactType || ContactType.INDIVIDUAL;
    
    // Common fields for Individual and Employee
    contact.firstName = data.firstName;
    contact.lastName = data.lastName;
    contact.email = data.email;
    contact.phoneNumber = data.phoneNumber;
    contact.workPhone = data.workPhone;
    contact.dateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth) : null;
    
    // Address information
    contact.primaryAddress = data.primaryAddress;
    contact.city = data.city;
    contact.state = data.state;
    contact.zipCode = data.zipCode;
    
    // Individual/Employee specific fields
    contact.occupation = data.occupation;
    contact.employer = data.employer;
    contact.spouse = data.spouse;
    contact.ssn = data.ssn;
    contact.mbiNumber = data.mbiNumber;
    
    // Business specific fields
    contact.companyName = data.companyName;
    contact.industryType = data.industryType;
    contact.ownerName = data.ownerName;
    contact.ownerTitle = data.ownerTitle;
    contact.ownerEmail = data.ownerEmail;
    contact.ownerPhone = data.ownerPhone;
    contact.otherName = data.otherName;
    contact.otherTitle = data.otherTitle;
    contact.otherEmail = data.otherEmail;
    contact.otherPhone = data.otherPhone;
    
    // Employee specific fields
    contact.parentCompany = data.parentCompany;
    
    // Common notes field
    contact.notes = data.notes;
    
    // Source and referral
    contact.source = data.source;
    contact.referredBy = data.referredBy;
    
    contact.status = data.status || ContactStatus.PROSPECT;
    contact.isLocked = data.isLocked || false;
    contact.isFromGoogle = data.isFromGoogle || false;
    contact.googleContactId = data.googleContactId;
    contact.googleTags = data.googleTags || [];
    contact.agentId = data.agentId;

    return contact;
  }
}

