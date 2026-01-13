import { BrokerTypeEnum } from '@/brokers/brokers.enum';
import { BrokerEntity } from '@/brokers/infrastructure/persistence/relational/entities/broker.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BrokerSeedService {
  constructor(
    @InjectRepository(BrokerEntity)
    private readonly brokerRepo: Repository<BrokerEntity>,
  ) {}

  async getOrCreateFromName(name: string) {
    let broker = await this.brokerRepo.findOne({
      where: { name },
    });
    if (!broker) {
      broker = this.brokerRepo.create({
        name,
        brokerType: BrokerTypeEnum.IMO, // confirm what to use for this
      });
      broker = await this.brokerRepo.save(broker);
    }
    return broker;
  }

  async getOrCreateMultiple(names: string[]) {
    const results: any[] = [];
    for (const name of names) {
      const broker = await this.getOrCreateFromName(name);
      results.push(broker);
    }
    return results;
  }
}
