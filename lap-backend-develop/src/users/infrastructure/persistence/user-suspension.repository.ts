import { User } from '@/users/domain/user';
import { UserSuspension } from '@/users/domain/user-suspension';
import { EntityCondition } from '@/utils/types/entity-condition.type';
import { NullableType } from '@/utils/types/nullable.type';

export abstract class UserSuspensionRepository {
  abstract create(
    data: Omit<UserSuspension, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<UserSuspension>;

  abstract findMany(
    fields: EntityCondition<UserSuspension>,
  ): Promise<UserSuspension[]>;

  abstract findOne(
    fields: EntityCondition<UserSuspension>,
  ): Promise<NullableType<UserSuspension>>;

  abstract isUserSuspended(userId: User['id']): Promise<boolean>;

  abstract update(
    id: UserSuspension['id'],
    payload: Partial<UserSuspension>,
  ): Promise<UserSuspension | null>;

  abstract softDelete(id: UserSuspension['id']): Promise<void>;

  abstract findActiveSuspensionsByUserId(
    userId: User['id'],
  ): Promise<UserSuspension[]>;
}
