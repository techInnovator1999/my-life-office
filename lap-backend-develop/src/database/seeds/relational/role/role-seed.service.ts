import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from 'src/roles/infrastructure/persistence/relational/entities/role.entity';
import { RoleEnum } from 'src/roles/roles.enum';
import { Repository } from 'typeorm';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(RoleEntity)
    private repository: Repository<RoleEntity>,
  ) {}

  async run() {
    const countUser = await this.repository.count({
      where: {
        id: RoleEnum.CLIENT,
      },
    });

    if (!countUser) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.CLIENT,
          name: 'Client',
        }),
      );
    }

    const countAdmin = await this.repository.count({
      where: {
        id: RoleEnum.ADMIN,
      },
    });

    if (!countAdmin) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.ADMIN,
          name: 'Admin',
        }),
      );
    }

    const countAccountManager = await this.repository.count({
      where: {
        id: RoleEnum.ACCOUNT_MANAGER,
      },
    });

    if (!countAccountManager) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.ACCOUNT_MANAGER,
          name: 'AccountManager',
        }),
      );
    }
  }
}
