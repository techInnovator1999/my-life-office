import { Injectable } from '@nestjs/common';
import { Broker } from '@/brokers/domain/broker';

@Injectable()
export abstract class BrokerRepository {
  abstract create(
    broker: Omit<Broker, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Broker>;

  abstract findAll(): Promise<{ data: Broker[]; total: number }>;

  abstract remove(id: Broker['id']): Promise<void>;

  abstract update(id: Broker['id'], payload: Partial<Broker>): Promise<Broker>;

  abstract findOneById(id: Broker['id']): Promise<Broker | null>;
}
