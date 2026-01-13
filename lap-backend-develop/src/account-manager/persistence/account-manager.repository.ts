import { DeepPartial } from 'typeorm';
import { NullableType } from '@/utils/types/nullable.type';
import { EntityCondition } from '@/utils/types/entity-condition.type';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { AccountManager } from '../domain/account-manager';
import { SortAccountManagerDto } from '../dto/query-account-manager.dto';
import { FindAllAccountManagerDto } from '../dto/find-all-account-managers.dto';

export abstract class AccountManagerRepository {
  abstract create(
    data: Omit<AccountManager, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<AccountManager>;

  abstract update(
    id: AccountManager['id'],
    payload: DeepPartial<AccountManager>,
  ): Promise<AccountManager | null>;
  abstract findOne(
    fields: EntityCondition<AccountManager>,
  ): Promise<NullableType<AccountManager>>;
  abstract findByUserId(userId: string): Promise<NullableType<AccountManager>>;

  abstract findManyWithPagination({
    status,
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    status?: string;
    filterOptions?: Record<string, string> | null;
    sortOptions?: SortAccountManagerDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<{ total: number; data: FindAllAccountManagerDto[] }>;
}
