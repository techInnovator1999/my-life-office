import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { ContactRepository } from '@/contacts/infrastructure/persistence/contact.repository';
import { Contact } from '@/contacts/domain/contact';
import { ContactEntity } from '../entities/contact.entity';
import { ContactMapper } from '../mappers/contact.mapper';
import { NullableType } from '@/utils/types/nullable.type';
import {
  FilterContactDto,
  SortContactDto,
} from '@/contacts/dto/query-contact.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { EntityCondition } from '@/utils/types/entity-condition.type';
import { FindAllContactDto } from '@/contacts/dto/find-all-contact.dto';

@Injectable()
export class ContactRelationalRepository implements ContactRepository {
  constructor(
    @InjectRepository(ContactEntity)
    private readonly contactRepo: Repository<ContactEntity>,
  ) {}

  async create(data: Contact): Promise<Contact> {
    const persistenceModel = ContactMapper.toPersistence(data);
    const entity = this.contactRepo.create(persistenceModel);
    const newEntity = await this.contactRepo.save(entity);
    return ContactMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterContactDto | null;
    sortOptions?: SortContactDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<{ total: number; data: ContactEntity[] }> {
    const where: FindOptionsWhere<ContactEntity> = {};

    if (filterOptions) {
      if (filterOptions.agentId) {
        where.agentId = filterOptions.agentId;
      }

      if (filterOptions.contactType) {
        where.contactType = filterOptions.contactType;
      }

      if (filterOptions.status) {
        where.status = filterOptions.status;
      }

      if (filterOptions.isLocked !== undefined) {
        where.isLocked = filterOptions.isLocked;
      }

      if (filterOptions.isFromGoogle !== undefined) {
        where.isFromGoogle = filterOptions.isFromGoogle;
      }

      // Search by name or email
      if (filterOptions.search) {
        where.firstName = ILike(`%${filterOptions.search}%`);
        // Note: TypeORM doesn't support OR in FindOptionsWhere easily,
        // so we'll handle search in a query builder if needed
      }
    }

    const order: Record<string, 'ASC' | 'DESC'> = {};
    if (sortOptions && sortOptions.length > 0) {
      sortOptions.forEach((s) => {
        if (s.orderBy) {
          order[s.orderBy] = s.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        }
      });
    } else {
      // Default sort by createdAt descending
      order.createdAt = 'DESC';
    }

    const queryBuilder = this.contactRepo.createQueryBuilder('contact');

    // Apply filters
    if (filterOptions?.agentId) {
      queryBuilder.andWhere('contact.agentId = :agentId', {
        agentId: filterOptions.agentId,
      });
    }

    if (filterOptions?.contactType) {
      queryBuilder.andWhere('contact.contactType = :contactType', {
        contactType: filterOptions.contactType,
      });
    }

    if (filterOptions?.status) {
      queryBuilder.andWhere('contact.status = :status', {
        status: filterOptions.status,
      });
    }

    if (filterOptions?.isLocked !== undefined) {
      queryBuilder.andWhere('contact.isLocked = :isLocked', {
        isLocked: filterOptions.isLocked,
      });
    }

    if (filterOptions?.isFromGoogle !== undefined) {
      queryBuilder.andWhere('contact.isFromGoogle = :isFromGoogle', {
        isFromGoogle: filterOptions.isFromGoogle,
      });
    }

    // Search functionality
    if (filterOptions?.search) {
      queryBuilder.andWhere(
        '(contact.firstName ILIKE :search OR contact.lastName ILIKE :search OR contact.email ILIKE :search)',
        { search: `%${filterOptions.search}%` },
      );
    }

    // Apply relations
    queryBuilder.leftJoinAndSelect('contact.agent', 'agent');

    // Apply sorting
    Object.keys(order).forEach((key) => {
      queryBuilder.addOrderBy(`contact.${key}`, order[key]);
    });

    // Apply pagination
    queryBuilder.skip((paginationOptions.page - 1) * paginationOptions.limit);
    queryBuilder.take(paginationOptions.limit);

    const [entities, total] = await queryBuilder.getManyAndCount();

    return { total, data: entities };
  }

  async findMany(
    fields: EntityCondition<Contact>,
  ): Promise<FindAllContactDto[]> {
    const entities = await this.contactRepo.find({
      where: fields as FindOptionsWhere<ContactEntity>,
      relations: ['agent'],
    });

    return entities.map((contact) => ContactMapper.toDomainMany(contact));
  }

  async findOne(
    fields: EntityCondition<Contact>,
  ): Promise<NullableType<Contact>> {
    const entity = await this.contactRepo.findOne({
      where: fields as FindOptionsWhere<ContactEntity>,
      relations: ['agent'],
    });

    return entity ? ContactMapper.toDomain(entity) : null;
  }

  async findOneById(id: Contact['id']): Promise<NullableType<ContactEntity>> {
    const entity = await this.contactRepo.findOne({
      where: { id },
      relations: ['agent'],
    });

    return entity ?? null;
  }

  async update(
    id: Contact['id'],
    payload: Partial<Contact>,
  ): Promise<Contact> {
    const entity = await this.contactRepo.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException('Contact not found');
    }

    const domain = ContactMapper.toDomain(entity);
    const updatedDomain = { ...domain, ...payload };
    const updatedData = ContactMapper.toPersistence(updatedDomain);
    Object.assign(entity, updatedData);

    const updatedEntity = await this.contactRepo.save(entity);

    return ContactMapper.toDomain(updatedEntity);
  }

  async softDelete(id: Contact['id']): Promise<void> {
    await this.contactRepo.softDelete(id);
  }

  async delete(id: Contact['id']): Promise<void> {
    await this.contactRepo.delete(id);
  }

  findOrFail(id: Contact['id']): Promise<Contact> {
    return this.contactRepo
      .findOne({ where: { id }, relations: ['agent'] })
      .then((entity) => {
        if (!entity) {
          throw new NotFoundException('Contact not found');
        }
        return ContactMapper.toDomain(entity);
      });
  }
}



