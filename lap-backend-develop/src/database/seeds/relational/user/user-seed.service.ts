import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { RoleEnum } from 'src/roles/roles.enum';
import { AllConfigType } from '@/config/config.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}
  adminFirstName = this.configService.getOrThrow('user.adminFirstName', {
    infer: true,
  });
  adminPassword = this.configService.getOrThrow('user.adminPassword', {
    infer: true,
  });
  adminLastName = this.configService.getOrThrow('user.adminLastName', {
    infer: true,
  });
  adminEmail = this.configService.getOrThrow('user.adminEmail', {
    infer: true,
  });
  clientFirstName = this.configService.getOrThrow('user.clientFirstName', {
    infer: true,
  });
  clientLastName = this.configService.getOrThrow('user.clientLastName', {
    infer: true,
  });
  clientEmail = this.configService.getOrThrow('user.clientEmail', {
    infer: true,
  });
  clientPassword = this.configService.getOrThrow('user.clientPassword', {
    infer: true,
  });
  async run() {
    const countAdmin = await this.repository.count({
      where: {
        role: {
          id: RoleEnum.ADMIN,
        },
      },
    });

    if (!countAdmin) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash(this.adminPassword, salt);

      await this.repository.save(
        this.repository.create({
          firstName: this.adminFirstName,
          lastName: this.adminLastName,
          email: this.adminEmail,
          password,
          role: {
            id: RoleEnum.ADMIN,
            name: 'Admin',
          },
          status: {
            id: StatusEnum.ACTIVE,
            name: 'Active',
          },
        }),
      );
    }

    const countUser = await this.repository.count({
      where: {
        role: {
          id: RoleEnum.CLIENT,
        },
      },
    });

    if (!countUser) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash(this.clientPassword, salt);

      await this.repository.save(
        this.repository.create({
          firstName: this.clientFirstName,
          lastName: this.clientLastName,
          email: this.clientEmail,
          password,
          role: {
            id: RoleEnum.CLIENT,
            name: 'Client',
          },
          status: {
            id: StatusEnum.ACTIVE,
            name: 'Active',
          },
        }),
      );
    }
  }
}
