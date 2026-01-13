import { DepositType } from '@/deposit-types/domain/deposit-type';
import { FilterDepositTypeDto } from '@/deposit-types/dto/query-deposit-type.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class DepositTypeRepository {
  abstract create(
    data: Omit<DepositType, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<DepositType>;

  abstract findManyWithPagination({
    filterOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterDepositTypeDto | null;
    paginationOptions: IPaginationOptions;
  }): Promise<{ total: number; data: DepositType[] }>;

  abstract remove(id: DepositType['id']): Promise<void>;

  abstract findOne(id: DepositType['id']): Promise<DepositType>;

  abstract update(
    id: DepositType['id'],
    data: Partial<DepositType>,
  ): Promise<DepositType>;
}
