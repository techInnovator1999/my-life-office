import { Injectable } from '@nestjs/common';
import { DepositType } from './domain/deposit-type';
import { DepositTypeRepository } from './infrastructure/persistence/deposit-type.repository';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { FilterDepositTypeDto } from './dto/query-deposit-type.dto';

@Injectable()
export class DepositTypesService {
  constructor(private readonly depositTypeRepository: DepositTypeRepository) {}

  create(
    data: Omit<DepositType, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<DepositType> {
    return this.depositTypeRepository.create(data);
  }

  findManyWithPagination({
    filterOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterDepositTypeDto | null;
    paginationOptions: IPaginationOptions;
  }): Promise<{ total: number; data: DepositType[] }> {
    return this.depositTypeRepository.findManyWithPagination({
      filterOptions,
      paginationOptions,
    });
  }

  async findOne(id: DepositType['id']): Promise<DepositType> {
    return this.depositTypeRepository.findOne(id);
  }

  async remove(id: DepositType['id']): Promise<void> {
    return this.depositTypeRepository.remove(id);
  }

  async update(
    id: DepositType['id'],
    data: Partial<DepositType>,
  ): Promise<DepositType> {
    return this.depositTypeRepository.update(id, data);
  }
}
