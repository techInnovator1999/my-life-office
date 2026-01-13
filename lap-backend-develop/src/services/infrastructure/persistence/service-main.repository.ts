import { ServiceMain } from '../../domain/service-main';
import { NullableType } from 'src/utils/types/nullable.type';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { DeepPartial } from 'src/utils/types/deep-partial.type';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { SortServiceDto } from '@/services/dto/query-service.dto';
import { FilterMainServiceDto } from '@/services/dto/query-service.dto';

export abstract class ServiceMainRepository {
  abstract create(
    data: Omit<ServiceMain, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<ServiceMain>;

  abstract findManyWithPagination({
    filterOptions,
    id,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterMainServiceDto | null;
    id?: string | null;
    sortOptions?: SortServiceDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<{ total: number; data: ServiceMain[] }>; // GetAllServicesDto (add is_main: boolean)

  abstract findOne(
    fields: EntityCondition<ServiceMain>,
    isAdmin?: boolean,
  ): Promise<NullableType<ServiceMain>>;

  abstract findOneById(
    id: ServiceMain['id'],
  ): Promise<NullableType<ServiceMain>>;

  abstract update(
    id: ServiceMain['id'],
    payload: DeepPartial<ServiceMain>,
  ): Promise<ServiceMain | null>;

  abstract softDelete(id: ServiceMain['id']): Promise<void>;

  abstract delete(id: ServiceMain['id']): Promise<void>;

  abstract findOrFail(id: ServiceMain['id']): Promise<ServiceMain>;
}
