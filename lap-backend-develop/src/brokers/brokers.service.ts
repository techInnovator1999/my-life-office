import { Injectable } from '@nestjs/common';
import { Broker } from './domain/broker';
import { CreateBrokerDto } from './dto/create-broker.dto';
import { BrokerRepository } from './infrastructure/persistence/broker.repository';

@Injectable()
export class BrokersService {
  constructor(private readonly brokerRepository: BrokerRepository) {}

  async createBroker(brokerDto: CreateBrokerDto): Promise<Broker> {
    return this.brokerRepository.create(brokerDto);
  }

  async findAll(): Promise<{ data: Broker[]; total: number }> {
    return this.brokerRepository.findAll();
  }

  async remove(id: Broker['id']): Promise<void> {
    return this.brokerRepository.remove(id);
  }

  async update(id: Broker['id'], payload: Partial<Broker>): Promise<Broker> {
    return this.brokerRepository.update(id, payload);
  }

  async findOneById(id: Broker['id']): Promise<Broker | null> {
    return this.brokerRepository.findOneById(id);
  }
}
