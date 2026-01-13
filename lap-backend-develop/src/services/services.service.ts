import { Injectable } from '@nestjs/common';
import { ServiceMain } from './domain/service-main';
import { ServiceMainRepository } from './infrastructure/persistence/service-main.repository';
import { FilterMainServiceDto, SortServiceDto } from './dto/query-service.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';

@Injectable()
export class MainService {
  constructor(private readonly serviceMainRepo: ServiceMainRepository) {}

  async create(
    data: Omit<ServiceMain, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<ServiceMain> {
    const newService = await this.serviceMainRepo.create(data);
    return newService;
  }

  findManyWithPagination({
    filterOptions,
    id,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterMainServiceDto | null;
    id?: string | null;
    sortOptions?: SortServiceDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<{ total: number; data: ServiceMain[] }> {
    return this.serviceMainRepo.findManyWithPagination({
      filterOptions,
      id,
      sortOptions,
      paginationOptions,
    });
  }

  findOne(id: string): Promise<ServiceMain | null> {
    return this.serviceMainRepo.findOne({ id });
  }

  update(
    id: string,
    payload: Partial<ServiceMain>,
  ): Promise<ServiceMain | null> {
    return this.serviceMainRepo.update(id, payload);
  }

  async delete(id: string): Promise<void> {
    await this.serviceMainRepo.delete(id);
  }

  findOrFail(id: ServiceMain['id']): Promise<ServiceMain> {
    return this.serviceMainRepo.findOrFail(id);
  }
}
