import { ServiceSubType } from '../../domain/service-sub-type';
import { NullableType } from 'src/utils/types/nullable.type';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { UpdateSubServiceDto } from '@/services/dto/update-service.dto';

export abstract class SericeSubtypeRepository {
  abstract create(
    data: Omit<ServiceSubType, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<ServiceSubType>;

  abstract findManyWithPagination({
    paginationOptions,
    mainServiceId,
  }: {
    paginationOptions: {
      page: number;
      limit: number;
    };
    mainServiceId: string;
  }): Promise<{ total: number; data: ServiceSubType[] }>;

  abstract findOne(
    fields: EntityCondition<ServiceSubType>,
    isAdmin?: boolean,
  ): Promise<NullableType<ServiceSubType>>;

  abstract findOneById(
    id: ServiceSubType['id'],
  ): Promise<NullableType<ServiceSubType>>;

  abstract update(
    id: ServiceSubType['id'],
    payload: UpdateSubServiceDto,
  ): Promise<ServiceSubType | null>;

  abstract softDelete(id: ServiceSubType['id']): Promise<void>;

  abstract delete(id: ServiceSubType['id']): Promise<void>;

  abstract findOrFail(id: ServiceSubType['id']): Promise<ServiceSubType>;
}
