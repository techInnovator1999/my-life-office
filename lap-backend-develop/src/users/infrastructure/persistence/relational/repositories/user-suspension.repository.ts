import { Injectable } from '@nestjs/common';
import { UserSuspensionRepository } from '../../user-suspension.repository';
import { UserSuspension } from '@/users/domain/user-suspension';
import { EntityCondition } from '@/utils/types/entity-condition.type';
import { NullableType } from '@/utils/types/nullable.type';
import { UserSuspensionEntity } from '../entities/user-suspension.entity';
import { IsNull, LessThan, MoreThan, Or, Repository } from 'typeorm';
import { UserSuspensionMapper } from '../mappers/user-suspension.mapper';
import { User } from '@/users/domain/user';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserSuspensionRelationalRepository
  implements UserSuspensionRepository
{
  constructor(
    @InjectRepository(UserSuspensionEntity)
    private readonly userSuspensionRepository: Repository<UserSuspensionEntity>,
  ) {}
  async create(
    data: Omit<UserSuspension, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<UserSuspension> {
    const userSuspension = UserSuspensionMapper.toPersistence(
      data as UserSuspension,
    );
    const model = await this.userSuspensionRepository.save(
      this.userSuspensionRepository.create(userSuspension),
    );
    return UserSuspensionMapper.toDomain(model);
  }
  async findMany(
    fields: EntityCondition<UserSuspension>,
  ): Promise<UserSuspension[]> {
    const models = await this.userSuspensionRepository.find({
      where: fields as any,
      relations: { user: true },
    });
    return models.map(UserSuspensionMapper.toDomain);
  }
  async findOne(
    fields: EntityCondition<UserSuspension>,
  ): Promise<NullableType<UserSuspension>> {
    const model = await this.userSuspensionRepository.findOne({
      where: fields as any,
    });
    return model ? UserSuspensionMapper.toDomain(model) : null;
  }
  async isUserSuspended(userId: User['id']): Promise<boolean> {
    const currentDate = new Date();
    const isUserSuspended = await this.userSuspensionRepository.exists({
      where: {
        user: { id: userId },
        startDate: LessThan(currentDate),
        endDate: Or(IsNull(), MoreThan(currentDate)),
      },
    });
    return isUserSuspended;
  }
  async update(
    id: UserSuspension['id'],
    payload: Partial<UserSuspension>,
  ): Promise<UserSuspension> {
    const entity = await this.userSuspensionRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedData = UserSuspensionMapper.toPersistence({
      ...UserSuspensionMapper.toDomain(entity),
      ...payload,
    });

    // Assign the updated data to the existing entity
    Object.assign(entity, updatedData);

    // Save the updated entity
    const updatedEntity = await this.userSuspensionRepository.save(entity);

    return UserSuspensionMapper.toDomain(updatedEntity);
  }
  async softDelete(id: UserSuspension['id']): Promise<void> {
    await this.userSuspensionRepository.softDelete(id);
  }

  async findActiveSuspensionsByUserId(
    userId: User['id'],
  ): Promise<UserSuspension[]> {
    const currentDate = new Date();
    const models = await this.userSuspensionRepository.find({
      where: {
        user: { id: userId },
        startDate: LessThan(currentDate),
        endDate: Or(IsNull(), MoreThan(currentDate)),
      },
      relations: { user: true },
    });
    return models.map(UserSuspensionMapper.toDomain);
  }
}
