import { CreateSubscriptionDto } from '@/subscriptions/dto/create-subscription.dto';
import { SubscriptionsRepository } from '../../subscriptions.repository';
import { Subscription } from '@/subscriptions/domain/subscription';
import { SubscriptionEntity } from '../entities/subscription.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { SubscriptionMapper } from '../mappers/subscriptions.mapper';

export class SubscriptionsRelationalRepository
  implements SubscriptionsRepository
{
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepo: Repository<SubscriptionEntity>,
  ) {}

  async create(payload: CreateSubscriptionDto): Promise<SubscriptionEntity> {
    const subscription = new Subscription();
    subscription.name = payload.name;
    subscription.description = payload.description ?? null;

    const subscriptionDomainModel =
      SubscriptionMapper.toPersistence(subscription);
    const subscriptionEntity = this.subscriptionRepo.create(
      subscriptionDomainModel,
    );
    const savedSubscription =
      await this.subscriptionRepo.save(subscriptionEntity);
    return savedSubscription;
  }

  async findAll(): Promise<any> {
    const [entities, total] = await this.subscriptionRepo.findAndCount();
    return { data: entities, total };
  }

  async findOne(id: Subscription['id']): Promise<SubscriptionEntity> {
    const subscription = await this.subscriptionRepo.findOne({
      where: { id },
      relations: ['services'],
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with id ${id} not found`);
    }
    return subscription;
  }

  async update(
    id: string,
    updateData: Partial<SubscriptionEntity>,
  ): Promise<SubscriptionEntity> {
    await this.subscriptionRepo.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.subscriptionRepo.delete(id);
  }
}
