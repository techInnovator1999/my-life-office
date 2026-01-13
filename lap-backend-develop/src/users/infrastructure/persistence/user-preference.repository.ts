import { NullableType } from 'src/utils/types/nullable.type';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { DeepPartial } from 'src/utils/types/deep-partial.type';
import { UserPreference } from '@/users/domain/user-preference';
export abstract class UserPreferenceRepository {
  abstract create(
    data: Omit<UserPreference, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<UserPreference>;

  abstract findOne(
    fields: EntityCondition<UserPreference>,
    isAdmin?: boolean,
  ): Promise<NullableType<UserPreference>>;

  abstract update(
    id: UserPreference['id'],
    payload: DeepPartial<UserPreference>,
  ): Promise<UserPreference | null>;

  abstract softDelete(id: UserPreference['id']): Promise<void>;
}
