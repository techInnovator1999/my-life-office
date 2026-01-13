import { Contact } from '../../domain/contact';
import { NullableType } from '@/utils/types/nullable.type';
import { FilterContactDto, SortContactDto } from '../../dto/query-contact.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { EntityCondition } from '@/utils/types/entity-condition.type';
import { FindAllContactDto } from '@/contacts/dto/find-all-contact.dto';
import { ContactEntity } from './relational/entities/contact.entity';

export abstract class ContactRepository {
  abstract create(
    data: Omit<Contact, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Contact>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterContactDto | null;
    sortOptions?: SortContactDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<{ total: number; data: ContactEntity[] }>;

  abstract findMany(
    fields: EntityCondition<Contact>,
  ): Promise<FindAllContactDto[]>;

  abstract findOne(
    fields: EntityCondition<Contact>,
  ): Promise<NullableType<Contact>>;

  abstract findOneById(id: Contact['id']): Promise<NullableType<ContactEntity>>;

  abstract update(
    id: Contact['id'],
    payload: Partial<Contact>,
  ): Promise<Contact | null>;

  abstract softDelete(id: Contact['id']): Promise<void>;

  abstract delete(id: Contact['id']): Promise<void>;

  abstract findOrFail(id: Contact['id']): Promise<Contact>;
}



