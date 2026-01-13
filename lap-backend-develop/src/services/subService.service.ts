import { Injectable, NotFoundException } from '@nestjs/common';
import { SericeSubtypeRepository } from './infrastructure/persistence/service-sub-type.repository';
import { ServiceSubType } from './domain/service-sub-type';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { CreateSubServiceDto } from './dto/create-sub-service.dto';
import { UpdateSubServiceDto } from './dto/update-service.dto';
import { ServiceMainRepository } from './infrastructure/persistence/service-main.repository';

@Injectable()
export class SubService {
  constructor(
    private readonly serviceSubRepo: SericeSubtypeRepository,
    private readonly serviceMainRepo: ServiceMainRepository,
  ) {}

  async create(data: CreateSubServiceDto): Promise<ServiceSubType> {
    const serviceMain = await this.serviceMainRepo.findOneById(
      data.serviceMainId,
    );
    if (!serviceMain) {
      throw new NotFoundException(
        `ServiceMain with id ${data.serviceMainId} not found`,
      );
    }

    const domainObj = {
      ...data,
      serviceMain,
    };
    const newService = await this.serviceSubRepo.create(domainObj);
    return newService;
  }

  findManyWithPagination({
    paginationOptions,
    mainServiceId,
  }: {
    paginationOptions: IPaginationOptions;
    mainServiceId: string;
  }): Promise<{ total: number; data: ServiceSubType[] }> {
    return this.serviceSubRepo.findManyWithPagination({
      paginationOptions,
      mainServiceId,
    });
  }

  findOne(id: string): Promise<ServiceSubType | null> {
    return this.serviceSubRepo.findOne({ id });
  }

  update(
    id: string,
    payload: UpdateSubServiceDto,
  ): Promise<ServiceSubType | null> {
    return this.serviceSubRepo.update(id, payload);
  }

  async delete(id: string): Promise<void> {
    await this.serviceSubRepo.delete(id);
  }

  findOrFail(id: ServiceSubType['id']): Promise<ServiceSubType> {
    return this.serviceSubRepo.findOrFail(id);
  }
}
