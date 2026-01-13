import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { FindOptionsWhere, Repository } from 'typeorm';
import { NullableType } from '@/utils/types/nullable.type';
import { UserPreferenceRepository } from '../../user-preference.repository';
import { UserPreferenceEntity } from '../entities/user-preference.entity';
import { UserPreference } from '@/users/domain/user-preference';
import { UserPreferenceMapper } from '../mappers/user-preference.mapper';

@Injectable()
export class UserPreferenceRelationalRepository
  implements UserPreferenceRepository
{
  constructor(
    @InjectRepository(UserPreferenceEntity)
    private readonly usersRepository: Repository<UserPreferenceEntity>,
  ) {}

  async create(data: UserPreference): Promise<UserPreference> {
    const persistenceModel = UserPreferenceMapper.toPersistence(data);
    const newEntity = await this.usersRepository.save(
      this.usersRepository.create(persistenceModel),
    );
    return UserPreferenceMapper.toDomain(newEntity);
  }

  async findOne(
    fields: EntityCondition<UserPreference>,
  ): Promise<NullableType<UserPreference>> {
    const entity = await this.usersRepository.findOne({
      where: fields as FindOptionsWhere<UserPreferenceEntity>,
      relations: {
        user: true,
      },
    });

    return entity ? UserPreferenceMapper.toDomain(entity) : null;
  }

  async update(
    id: UserPreference['id'],
    payload: Partial<UserPreference>,
  ): Promise<UserPreference> {
    const entity = await this.usersRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('UserPreference not found');
    }

    const updatedData = UserPreferenceMapper.toPersistence({
      ...UserPreferenceMapper.toDomain(entity),
      ...payload,
    });

    // Assign the updated data to the existing entity
    Object.assign(entity, updatedData);

    // Save the updated entity
    const updatedEntity = await this.usersRepository.save(entity);

    return UserPreferenceMapper.toDomain(updatedEntity);
  }

  async softDelete(id: UserPreference['id']): Promise<void> {
    await this.usersRepository.softDelete(id);
  }
}
