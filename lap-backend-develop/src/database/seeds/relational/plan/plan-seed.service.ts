import { PlanEntity } from '@/plan/persistence/relational/entities/plan.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PlanSeedService {
  constructor(
    @InjectRepository(PlanEntity)
    private repository: Repository<PlanEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      const plans = [
        {
          id: '64f59cf4-7350-4c78-9c26-7e58e3bb62c6',
          name: 'Health Care',
          description: 'Assign someone or yourself to take over health powers',
          price: 60,
        },
        {
          id: 'b62d28fe-d173-4406-a41d-5671ed4840dc',
          name: 'Last Will and Testament',
          description: 'Ideal for renters. Assign Guardians and beneficiaries.',
          price: 350,
        },
        {
          id: '290fe89d-56c5-429c-b069-61dd865f0e7d',
          name: 'Medicare',
          description:
            'Assign someone or yourself to take over Medicare powers',
          price: 750,
        },
      ];

      await this.repository.save(plans);
    }
  }
}
