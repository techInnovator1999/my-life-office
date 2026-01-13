import { Carrier } from '../../domain/carrier';
import { NullableType } from 'src/utils/types/nullable.type';
import { FilterCarrierDto, SortCarrierDto } from '../../dto/query-carrier.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { FindAllCarrierDto } from '@/carriers/dto/find-all-carrier.dto';
import { CarrierEntity } from './relational/entities/carrier.entity';

export abstract class CarrierRepository {
  abstract create(
    data: Omit<Carrier, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Carrier>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterCarrierDto | null;
    sortOptions?: SortCarrierDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<{ total: number; data: CarrierEntity[] }>;

  abstract findMany(
    fields: EntityCondition<Carrier>,
  ): Promise<FindAllCarrierDto[]>;

  abstract findOne(
    fields: EntityCondition<Carrier>,
    isAdmin?: boolean,
  ): Promise<NullableType<Carrier>>;

  abstract findOneById(id: Carrier['id']): Promise<NullableType<CarrierEntity>>;

  abstract update(
    id: Carrier['id'],
    payload: Partial<Carrier>,
  ): Promise<Carrier | null>;

  abstract softDelete(id: Carrier['id']): Promise<void>;

  abstract delete(id: Carrier['id']): Promise<void>;

  abstract findOrFail(id: Carrier['id']): Promise<Carrier>;
}
