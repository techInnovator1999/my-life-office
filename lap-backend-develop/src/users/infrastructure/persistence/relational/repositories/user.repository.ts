import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { StatusEnum as StatusesEnum } from '@/statuses/statuses.enum';

import {
  Between,
  FindManyOptions,
  FindOperator,
  FindOptionsWhere,
  In,
  IsNull,
  LessThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { SortUserDto } from '../../../../dto/query-user.dto';
import { User } from '../../../../domain/user';
import { UserRepository } from '../../user.repository';
import { UserMapper } from '../mappers/user.mapper';
import { RoleEnum } from '@/roles/roles.enum';
import { AccountManagerStatusEnum, FilterUserEnum } from '@/users/users.enum';
import { FindAllUserDto } from '@/users/dto/find-all-user.dto';
import moment from 'moment-timezone';
import { StatusEnum } from '@/statuses/statuses.enum';

@Injectable()
export class UsersRelationalRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(data: User, isShowToolTip?: boolean): Promise<User> {
    const dataToCreate = data;

    if (isShowToolTip) dataToCreate.isShowToolTip = true;

    const persistenceModel = UserMapper.toPersistence(dataToCreate);
    const newEntity = await this.usersRepository.save(
      this.usersRepository.create(persistenceModel),
    );
    return UserMapper.toDomain(newEntity);
  }

  async findMany(fields: EntityCondition<User>): Promise<FindAllUserDto[]> {
    const entity = await this.usersRepository.find({
      where: fields as FindOptionsWhere<UserEntity>,
    });

    return entity.map((pkg) => UserMapper.toDomainMany(pkg));
  }

  async findAllWithConditions(
    where: FindOptionsWhere<UserEntity>,
    page?: number,
    limit?: number,
  ): Promise<{
    entities: UserEntity[];
    total: number;
  }> {
    const findManyOptions: FindManyOptions<UserEntity> = {
      loadEagerRelations: false,
      where: where,
      relations: ['cart', 'referralPartner'],
    };

    // Pagination
    if (page && limit) {
      const take = limit;
      const skip = (page - 1) * take;
      findManyOptions.take = take;
      findManyOptions.skip = skip;
    }

    const [entities, total] =
      await this.usersRepository.findAndCount(findManyOptions);

    return { entities, total };
  }

  async filterRegisteredUsersBySixMonths(): Promise<any> {
    const entity = await this.usersRepository.query(
      `WITH months AS (
            SELECT
                TO_CHAR(date_trunc('month', CURRENT_DATE) - interval '1 month' * generate_series(0, 5), 'Mon YYYY') AS month
        )
        SELECT
            m.month AS month,
            COALESCE(COUNT(u.id), 0) AS registered_users
        FROM
            months m
        LEFT JOIN (
            SELECT
                DATE_TRUNC('month', "createdAt") AS month,
                id
            FROM
                "user"
            WHERE
                "createdAt" >= NOW() - INTERVAL '6 months'
        ) u
        ON m.month = TO_CHAR(u.month, 'Mon YYYY')
        GROUP BY
            m.month
        ORDER BY
            date_trunc('month', TO_DATE(m.month, 'Mon YYYY'));`,
    );

    const months = entity.map((row) => row.month);
    const registered_users = entity.map((row) =>
      parseFloat(row.registered_users),
    );

    return { months, registered_users };
  }

  async findManyWithPagination({
    filterOptions,
    userId,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: Record<string, string> | null;
    userId?: string | null;
    role: string;
    currentUserId: string;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }) {
    const where: FindOptionsWhere<UserEntity> = {};
    // Exclude admin users based on their role

    where.role = { id: In([RoleEnum.CLIENT]) };

    if (userId) {
      where.id = userId;
    }

    // Apply additional filters from filterOptions
    if (filterOptions) {
      if (filterOptions['user']) {
        if (
          filterOptions['user'] ==
          FilterUserEnum.REGISTERED_USERS_LESS_THAN_SIXTY_DAYS
        ) {
          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0); // Set current date to midnight (optional)

          // Use setDate to add 60 days to the current date
          const thresholdDate = new Date(currentDate);
          thresholdDate.setDate(currentDate.getDate() - 60);

          where.createdAt = MoreThanOrEqual(thresholdDate);
        } else if (
          filterOptions['user'] ==
          FilterUserEnum.REGISTERED_USERS_MORE_THAN_SIXTY_DAYS
        ) {
          const currentDate = new Date();
          const thresholdDate = new Date(currentDate);
          thresholdDate.setDate(thresholdDate.getDate() - 60);

          where.createdAt = LessThan(thresholdDate);
        } else if (
          filterOptions['user'] == FilterUserEnum.TOTAL_REGISTERED_USERS
        ) {
          where.id = Not(IsNull());
        } else if (filterOptions['user'] == FilterUserEnum.ABANDONED_USERS) {
          where.status = { id: StatusEnum?.ABANDONED };
        } else if (filterOptions['user'] == FilterUserEnum.ACTIVE_USERS) {
          where.status = { id: In([StatusEnum.ACTIVE, StatusEnum.INACTIVE]) };
        } else if (filterOptions['user'] == FilterUserEnum.SUSPEND_USERS) {
          where.status = { id: StatusEnum?.SUSPENDED };
        }
      }
    }

    // Count total records
    const total = await this.usersRepository.count({ where });
    const entities = await this.usersRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      relations: {
        photo: true,
      },
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    // Convert entities to domain objects
    const data = entities.map((user) => UserMapper.toDomainMany(user));
    return { total, data };
  }

  async findOne(fields: EntityCondition<User>): Promise<NullableType<User>> {
    const entity = await this.usersRepository.findOne({
      where: fields as FindOptionsWhere<UserEntity>,
      relations: {
        role: true,
        status: true,
        photo: true,
        accountManager: true,
      },
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findOneById(id: User['id']): Promise<NullableType<User>> {
    const entity = await this.usersRepository.findOne({ where: { id } });
    const domain = entity ? UserMapper.toDomain(entity) : null;
    return domain;
  }

  async countTotalRegisteredUsers(
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ count: number }> {
    const where: FindOptionsWhere<UserEntity> = {};
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate);
    }
    // (where.role = { id: In[RoleEnum.CLIENT] }), (where.id = Not(IsNull()));
    where.role = { id: In([RoleEnum.CLIENT]) };
    where.id = Not(IsNull());
    return {
      count: await this.usersRepository.count({
        where: where,
      }),
    };
  }

  async countTotalRegisteredUsersByMonths(
    startDate: Date,
    endDate: Date,
  ): Promise<{ month: string; count: number }[]> {
    const months: { month: string; count: number }[] = [];
    const current = moment.utc(startDate).startOf('month');

    while (current.isSameOrBefore(moment.utc(endDate), 'month')) {
      months.push({ month: current.format('MMMM'), count: 0 });
      current.add(1, 'month'); // Move to the next month
    }

    const results = await this.usersRepository
      .createQueryBuilder('u') // Alias 'user' as 'u'
      .select(
        "TO_CHAR(DATE_TRUNC('month', u.\"createdAt\"), 'FMMonth')",
        'month',
      )
      .addSelect('COUNT(u.id)', 'count')
      .where('u.role IN (:...roles)', {
        roles: [RoleEnum.CLIENT],
      })
      .andWhere('u.id IS NOT NULL')
      .andWhere('u."createdAt" >= :startDate', { startDate })
      .andWhere('u."createdAt" <= :endDate', { endDate })
      .groupBy('DATE_TRUNC(\'month\', u."createdAt")')
      .orderBy('DATE_TRUNC(\'month\', u."createdAt")', 'ASC')
      .getRawMany();

    const mergedResults = months.map((month) => {
      const result = results.find(
        (r) => r.month.toLowerCase() === month.month.toLowerCase(),
      );
      return {
        month: month.month,
        count: result ? parseInt(result.count, 10) : 0,
      };
    });

    return mergedResults;
  }

  async countAccountManagerStasuses(): Promise<any> {
    // Retrieve the raw data from the database, counting the number of orders per status
    const rawData = await this.usersRepository
      .createQueryBuilder('u')
      .leftJoin('u.role', 'r')
      .select('u.accountManagerStatus', 'status')
      .addSelect('COUNT(u.id)', 'count')
      .where('u.accountManagerStatus IS NOT NULL')
      .andWhere(`r.id = '${RoleEnum.ACCOUNT_MANAGER}'`)
      .groupBy('u.accountManagerStatus')
      .getRawMany();

    // Get all possible statuses from the StatusEnum
    const statuses = Object.values(AccountManagerStatusEnum);
    const rslt: any = {};
    let totalCount = 0; // Initialize the total count

    statuses.forEach((statusName) => {
      // Convert the status number to its corresponding status name\

      // Initialize the count as 0 for each status
      let count = 0;

      // Find the corresponding count from the raw data
      const statusCount = rawData.find((r) => r.status === statusName);
      if (statusCount) {
        // Update the count if the status exists in the raw data
        count = parseInt(statusCount.count, 10);
      }

      // Add the count to the total count if the status is not ARCHIVED
      if (statusName !== null) {
        totalCount += count;
      }

      // Add the result to the output object
      rslt[statusName] = count;
    });

    // Add the total count to the output object
    rslt['Total'] = totalCount;

    return rslt;
  }

  async countRegUsersMoreThanSixtyDays(): Promise<{ count: number }> {
    const currentDate = new Date();
    const thresholdDate = new Date(currentDate);
    thresholdDate.setDate(thresholdDate.getDate() - 60);
    const where: FindOptionsWhere<UserEntity> = {};
    where.createdAt = LessThan(thresholdDate);
    where.role = { id: In[RoleEnum.CLIENT] };
    return {
      count: await this.usersRepository.count({
        where: where,
      }),
    };
  }

  async countRegUsersLessThanSixtyDays(): Promise<{ count: number }> {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set current date to midnight (optional)
    // Use setDate to add 60 days to the current date
    const thresholdDate = new Date(currentDate);
    thresholdDate.setDate(currentDate.getDate() - 60);
    const where: FindOptionsWhere<UserEntity> = {};
    where.createdAt = MoreThanOrEqual(thresholdDate);
    where.role = { id: In[RoleEnum.CLIENT] };
    return {
      count: await this.usersRepository.count({
        where: where,
      }),
    };
  }

  async update(id: User['id'], payload: Partial<User>): Promise<User> {
    const entity = await this.usersRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('User not found');
    }

    const updatedData = UserMapper.toPersistence({
      ...UserMapper.toDomain(entity),
      ...payload,
    });

    // Assign the updated data to the existing entity
    Object.assign(entity, updatedData);

    // Save the updated entity
    const updatedEntity = await this.usersRepository.save(entity);

    return UserMapper.toDomain(updatedEntity);
  }

  async delete(id: User['id']): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async softDelete(id: User['id']): Promise<void> {
    await this.usersRepository.softDelete(id);
  }

  async deactivateUser(id: User['id'], reason: string | null): Promise<void> {
    await this.usersRepository.update(id, {
      deactivatedAt: new Date(),
      deactivatedReason: reason,
      status: { id: StatusesEnum.SUSPENDED },
    });
  }

  async abandonedUser(id: User['id']): Promise<void> {
    const payload = {
      status: { id: StatusesEnum.ABANDONED },
      deactivatedAt: null,
      deactivatedReason: null,
    };
    await this.usersRepository.update(id, payload);
  }

  async activateUser(id: User['id']): Promise<void> {
    await this.usersRepository.update(id, {
      deactivatedAt: null,
      deactivatedReason: null,
      status: { id: StatusesEnum.ACTIVE },
    });
  }

  async deactivateAccountManager(id: User['id']): Promise<void> {
    await this.usersRepository.update(id, {
      deactivatedAt: new Date(),
      status: { id: StatusesEnum.SUSPENDED },
    });
  }

  async abandonedAccountManager(id: User['id']): Promise<void> {
    const payload = {
      status: { id: StatusesEnum.ABANDONED },
      deactivatedAt: null,
    };
    await this.usersRepository.update(id, payload);
  }

  async activateAccountManager(id: User['id']): Promise<void> {
    await this.usersRepository.update(id, {
      deactivatedAt: null,
      status: { id: StatusesEnum.ACTIVE },
    });
  }

  async countAndGroupLeadSources(
    startDate: Date,
    endDate: Date,
  ): Promise<{ name: string; value: string }[]> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .select('user.heardBy', 'name')
      .addSelect('COUNT(*)', 'value')
      .where('user.heardBy IS NOT NULL')
      .andWhere('user.createdAt >= :startDate', { startDate })
      .andWhere('user.createdAt <= :endDate', { endDate })
      .groupBy('user.heardBy')
      .getRawMany();
  }

  async groupUsersByReferenceCode(
    startDate: Date,
    endDate: Date,
  ): Promise<{ name: string; value: number }[]> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .select([
        "CASE WHEN user.reference_code IS NOT NULL THEN 'Referral' ELSE 'Skipped' END AS name",
        'CAST(COUNT(*) AS INTEGER) AS value',
      ])
      .where('user.createdAt >= :startDate', { startDate })
      .andWhere('user.createdAt <= :endDate', { endDate })
      .groupBy('name')
      .getRawMany();
  }

  async findWithLastLogin(
    lastLogin: FindOperator<Date>,
  ): Promise<NullableType<User[]>> {
    const users = await this.usersRepository.find({
      where: {
        lastLogin,
        deactivatedAt: IsNull(),
      },
    });

    return users;
  }

  async countBlockedUsers(): Promise<{ count: number }> {
    const where: FindOptionsWhere<UserEntity> = {};
    where.role = { id: In([RoleEnum.CLIENT]) };
    where.status = { id: In([StatusEnum.SUSPENDED]) };
    return {
      count: await this.usersRepository.count({
        where: where,
      }),
    };
  }

  async countTotalRegisteredClients(): Promise<{ count: number }> {
    const where: FindOptionsWhere<UserEntity> = {};
    where.role = { id: In([RoleEnum.CLIENT]) };
    where.id = Not(IsNull());
    return {
      count: await this.usersRepository.count({
        where: where,
      }),
    };
  }

  async countAbandonedClients(): Promise<{ count: number }> {
    const where: FindOptionsWhere<UserEntity> = {};
    where.role = { id: In([RoleEnum.CLIENT]) };
    where.status = { id: In([StatusEnum?.ABANDONED]) };
    return {
      count: await this.usersRepository.count({
        where: where,
      }),
    };
  }

  async countActiveClients(): Promise<{ count: number }> {
    const where: FindOptionsWhere<UserEntity> = {};
    where.role = { id: In([RoleEnum.CLIENT]) };
    where.status = { id: In([StatusEnum.ACTIVE, StatusEnum.INACTIVE]) };
    return {
      count: await this.usersRepository.count({
        where: where,
      }),
    };
  }
}
