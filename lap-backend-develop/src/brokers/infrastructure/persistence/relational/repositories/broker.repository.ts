import { InjectRepository } from '@nestjs/typeorm';
import { BrokerRepository } from '../../broker.repository';
import { BrokerEntity } from '../entities/broker.entity';
import { Repository } from 'typeorm';
import { Broker } from '@/brokers/domain/broker';
import { BrokerMapper } from '../mappers/broker.mapper';
import { NotFoundException } from '@nestjs/common';

export class BrokerRelationalRepository implements BrokerRepository {
  constructor(
    @InjectRepository(BrokerEntity)
    private readonly brokerRepository: Repository<BrokerEntity>,
  ) {}

  async create(broker: Broker): Promise<Broker> {
    const persistenceBroker = BrokerMapper.toPersistence(broker);
    const brokerEntity = this.brokerRepository.create(persistenceBroker);
    const savedEntity = await this.brokerRepository.save(brokerEntity);
    return BrokerMapper.toDomain(savedEntity);
  }

  async findAll(): Promise<{ data: Broker[]; total: number }> {
    const [entities, total] = await this.brokerRepository.findAndCount();
    return {
      data: entities.map((entity) => BrokerMapper.toDomain(entity)),
      total,
    };
  }

  async remove(id: Broker['id']): Promise<void> {
    const result = await this.brokerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Broker with id ${id} not found`);
    }
  }

  async update(id: Broker['id'], payload: Partial<Broker>): Promise<Broker> {
    const brokerEntity = await this.brokerRepository.findOneBy({ id });
    if (!brokerEntity) {
      throw new NotFoundException(`Broker with id ${id} not found`);
    }

    const brokerDomain = BrokerMapper.toDomain(brokerEntity);
    const updatedData = BrokerMapper.toPersistence({
      ...brokerDomain,
      ...payload,
    });
    Object.assign(brokerEntity, updatedData);

    const updatedEntity = await this.brokerRepository.save(brokerEntity);
    return BrokerMapper.toDomain(updatedEntity);
  }

  async findOneById(id: Broker['id']): Promise<Broker | null> {
    const entity = await this.brokerRepository.findOneBy({ id });
    return entity ? BrokerMapper.toDomain(entity) : null;
  }
}
