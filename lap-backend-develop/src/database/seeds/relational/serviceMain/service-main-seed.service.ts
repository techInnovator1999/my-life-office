import { ServiceMain } from '@/services/domain/service-main';
import { ServiceMainRepository } from '@/services/infrastructure/persistence/service-main.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceMainSeedService {
  constructor(private readonly serviceMainRepo: ServiceMainRepository) {}

  async getOrCreateByName(name: string) {
    console.log('fineOne for name: ', name);
    const serviceMain = await this.serviceMainRepo.findOne({
      name,
    });
    console.log(serviceMain);
    if (serviceMain) {
      return serviceMain;
    }
    console.log(`Found no main service with name: ${name}`);
    const service = new ServiceMain();
    service.name = name;
    service.carriers = [];
    service.depositTypes = [];
    service.serviceSubTypes = [];
    const newServiceMain = this.serviceMainRepo.create(service);
    return newServiceMain;
  }

  async getOrCreateMultiple(names: string[]) {
    const results: any[] = [];
    for (const name of names) {
      const service = await this.getOrCreateByName(name);
      results.push(service);
    }
    return results;
  }
}
