import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEntity } from 'src/statuses/infrastructure/persistence/relational/entities/status.entity';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { Repository } from 'typeorm';

@Injectable()
export class StatusSeedService {
  constructor(
    @InjectRepository(StatusEntity)
    private repository: Repository<StatusEntity>,
  ) {}

  async run() {
    const countActive = await this.repository.count({
      where: {
        name: 'Active',
      },
    });

    if (!countActive) {
      await this.repository.save([
        this.repository.create({
          id: StatusEnum.ACTIVE,
          name: 'Active',
        }),
      ]);
    }

    const countInActive = await this.repository.count({
      where: {
        name: 'InActive',
      },
    });

    if (!countInActive) {
      await this.repository.save([
        this.repository.create({
          id: StatusEnum.INACTIVE,
          name: 'Inactive',
        }),
      ]);
    }
    const countReqPasswordCon = await this.repository.count({
      where: {
        name: 'REQUIRED_PASSWORD_CONFIG',
      },
    });

    if (!countReqPasswordCon) {
      await this.repository.save([
        this.repository.create({
          id: StatusEnum.REQUIRED_PASSWORD_CONFIG,
          name: 'REQUIRED_PASSWORD_CONFIG',
        }),
      ]);
    }

    const countAbandoned = await this.repository.count({
      where: {
        name: 'Abandoned',
      },
    });

    if (!countAbandoned) {
      await this.repository.save([
        this.repository.create({
          id: StatusEnum.ABANDONED,
          name: 'Abandoned',
        }),
      ]);
    }

    const countSuspended = await this.repository.count({
      where: {
        name: 'Suspended',
      },
    });

    if (!countSuspended) {
      await this.repository.save([
        this.repository.create({
          id: StatusEnum.SUSPENDED,
          name: 'Suspended',
        }),
      ]);
    }
  }
}
