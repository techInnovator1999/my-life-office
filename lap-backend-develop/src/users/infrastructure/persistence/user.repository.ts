import { User } from '../../domain/user';
import { NullableType } from 'src/utils/types/nullable.type';
import { SortUserDto } from '../../dto/query-user.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { DeepPartial } from 'src/utils/types/deep-partial.type';
import { FindAllUserDto } from '@/users/dto/find-all-user.dto';
import { UserEntity } from './relational/entities/user.entity';
import { FindOptionsWhere } from 'typeorm';

export abstract class UserRepository {
  abstract create(
    data: Omit<User, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
    isShowToolTip?: boolean,
  ): Promise<User>;

  abstract findManyWithPagination({
    filterOptions,
    userId,
    role,
    currentUserId,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: Record<string, string> | null;
    userId?: string | null;
    role: string;
    currentUserId: string;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<{ total: number; data: FindAllUserDto[] }>;

  abstract findMany(fields: EntityCondition<User>): Promise<FindAllUserDto[]>;

  abstract findAllWithConditions(
    where: FindOptionsWhere<UserEntity>,
    page?: number,
    limit?: number,
  ): Promise<{
    entities: UserEntity[];
    total: number;
  }>;

  abstract filterRegisteredUsersBySixMonths(): Promise<any>;
  abstract findOne(
    fields: EntityCondition<User>,
    isAdmin?: boolean,
  ): Promise<NullableType<User>>;

  abstract findOneById(id: User['id']): Promise<NullableType<User>>;

  abstract update(
    id: User['id'],
    payload: DeepPartial<User>,
  ): Promise<User | null>;

  abstract countAccountManagerStasuses(): Promise<any>;

  abstract countRegUsersMoreThanSixtyDays(): Promise<{ count: number }>;

  abstract countTotalRegisteredUsers(
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ count: number }>;

  abstract countTotalRegisteredUsersByMonths(
    startDate: Date,
    endDate: Date,
  ): Promise<{ month: string; count: number }[]>;

  abstract countRegUsersLessThanSixtyDays(): Promise<{ count: number }>;

  abstract softDelete(id: User['id']): Promise<void>;

  abstract delete(id: User['id']): Promise<void>;

  abstract deactivateUser(id: User['id'], reason: string | null): Promise<void>;

  abstract abandonedUser(id: User['id']): Promise<void>;

  abstract activateUser(id: User['id']): Promise<void>;

  abstract deactivateAccountManager(id: User['id']): Promise<void>;

  abstract abandonedAccountManager(id: User['id']): Promise<void>;

  abstract activateAccountManager(id: User['id']): Promise<void>;

  abstract countAndGroupLeadSources(
    startDate: Date,
    endDate: Date,
  ): Promise<{ name: string; value: string }[]>;

  abstract groupUsersByReferenceCode(
    startDate: Date,
    endDate: Date,
  ): Promise<{ name: string; value: number }[]>;

  abstract countBlockedUsers(
    role?: string | null,
    user?: string | null,
  ): Promise<{ count: number }>;

  abstract countTotalRegisteredClients(
    role?: string | null,
    user?: string | null,
  ): Promise<{ count: number }>;

  abstract countAbandonedClients(
    role?: string | null,
    user?: string | null,
  ): Promise<{ count: number }>;

  abstract countActiveClients(
    role?: string | null,
    user?: string | null,
  ): Promise<{ count: number }>;
}
