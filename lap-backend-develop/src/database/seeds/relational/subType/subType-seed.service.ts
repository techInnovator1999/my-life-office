import { ServiceSubTypeEntity } from '@/services/infrastructure/persistence/relational/entities/service-sub-type.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SubTypeSeedService {
  constructor(
    @InjectRepository(ServiceSubTypeEntity)
    private readonly subTypeRepository: Repository<ServiceSubTypeEntity>,
  ) {}

  async getOrCreateByName(name: string, serviceMainId: string) {
    const subType = await this.subTypeRepository.findOne({
      where: {
        name,
        serviceMain: { id: serviceMainId },
      },
    });
    if (subType) {
      return subType;
    }
    const newSubType = this.subTypeRepository.create({
      serviceMain: { id: serviceMainId },
      name,
      description: null,
    });
    return this.subTypeRepository.save(newSubType);
  }

  async getOrCreateMultiple(names: string[], serviceMainId: string) {
    const proms = names.map((name) =>
      this.getOrCreateByName(name, serviceMainId).catch((error) => ({
        error,
        name,
      })),
    );
    const results: any[] = await Promise.all(proms);
    return results;
  }
}
