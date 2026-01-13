import { NullableType } from 'src/utils/types/nullable.type';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { DeepPartial } from 'src/utils/types/deep-partial.type';
import { UserDevice } from '@/users/domain/user-device';
import { GetUserDeviceDto } from '@/users/dto/get-user-device.dto';
export abstract class UserDeviceRepository {
  abstract create(
    data: Omit<UserDevice, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<UserDevice>;

  abstract findMany(
    fields: EntityCondition<UserDevice>,
  ): Promise<GetUserDeviceDto[]>;
  abstract findOne(
    fields: EntityCondition<UserDevice>,
    isAdmin?: boolean,
  ): Promise<NullableType<UserDevice>>;

  abstract update(
    id: UserDevice['id'],
    payload: DeepPartial<UserDevice>,
  ): Promise<UserDevice | null>;

  abstract softDelete(id: UserDevice['id']): Promise<void>;
}
