import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionsRepository } from './infrastructure/persistence/subscriptions.repository';
import { SubscriptionEntity } from './infrastructure/persistence/relational/entities/subscription.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly subscriptionsRepository: SubscriptionsRepository,
  ) {}

  create(createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsRepository.create(createSubscriptionDto);
  }

  findAll(): Promise<any> {
    return this.subscriptionsRepository.findAll();
  }

  async findOneById(id: string): Promise<SubscriptionEntity> {
    return this.subscriptionsRepository.findOne(id);
  }

  update(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<SubscriptionEntity> {
    return this.subscriptionsRepository.update(id, updateSubscriptionDto);
  }

  remove(id: string): Promise<void> {
    return this.subscriptionsRepository.remove(id);
  }
}
