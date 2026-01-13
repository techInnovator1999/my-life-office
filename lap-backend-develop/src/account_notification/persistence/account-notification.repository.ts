import { NullableType } from 'src/utils/types/nullable.type';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { DeepPartial } from 'src/utils/types/deep-partial.type';
import { AccountNotification } from '../domain/account-notification';
import { SortAccountNotificationDto } from '../dto/query-account-notification.dto';
import { GetAccountNotificationDto } from '../dto/get-account-notification.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { JwtPayloadType } from '@/auth/strategies/types/jwt-payload.type';

export abstract class AccountNotificationRepository {
  abstract create(
    data: Omit<
      AccountNotification,
      'id' | 'createdAt' | 'deletedAt' | 'updatedAt'
    >,
  ): Promise<AccountNotification>;

  abstract findOne(
    fields: EntityCondition<AccountNotification>,
  ): Promise<NullableType<AccountNotification>>;

  abstract findManyWithPagination({
    sortOptions,
    paginationOptions,
    userJwtPayload,
  }: {
    sortOptions?: SortAccountNotificationDto[] | null;
    paginationOptions: IPaginationOptions;
    userJwtPayload: JwtPayloadType;
  }): Promise<{ total: number; data: GetAccountNotificationDto[] }>;

  abstract update(
    id: AccountNotification['id'],
    payload: DeepPartial<AccountNotification>,
  ): Promise<AccountNotification | null>;
}
