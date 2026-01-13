import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserDeviceEntity } from '../entities/user-device.entity';
import { UserDevice } from '@/users/domain/user-device';
import { UserDeviceRepository } from '../../user-device.repository';
import { UserDeviceMapper } from '../mappers/user-device.mapper';
import { NullableType } from '@/utils/types/nullable.type';
import { GetUserDeviceDto } from '@/users/dto/get-user-device.dto';

@Injectable()
export class UserDeviceRelationalRepository implements UserDeviceRepository {
  constructor(
    @InjectRepository(UserDeviceEntity)
    private readonly usersRepository: Repository<UserDeviceEntity>,
  ) {}

  async create(data: UserDevice): Promise<UserDevice> {
    const persistenceModel = UserDeviceMapper.toPersistence(data);
    const newEntity = await this.usersRepository.save(
      this.usersRepository.create(persistenceModel),
    );
    return UserDeviceMapper.toDomain(newEntity);
  }

  async findMany(
    fields: EntityCondition<UserDevice>,
  ): Promise<GetUserDeviceDto[]> {
    const entity = await this.usersRepository.find({
      where: fields as FindOptionsWhere<UserDeviceEntity>,
    });

    return entity.map((pkg) => UserDeviceMapper.toDomainMany(pkg));
  }
  async findOne(
    fields: EntityCondition<UserDevice>,
  ): Promise<NullableType<UserDevice>> {
    const entity = await this.usersRepository.findOne({
      where: fields as FindOptionsWhere<UserDeviceEntity>,
      relations: {
        user: true,
      },
    });

    return entity ? UserDeviceMapper.toDomain(entity) : null;
  }

  async update(
    id: UserDevice['id'],
    payload: Partial<UserDevice>,
  ): Promise<UserDevice> {
    const entity = await this.usersRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('UserDevice not found');
    }

    const updatedData = UserDeviceMapper.toPersistence({
      ...UserDeviceMapper.toDomain(entity),
      ...payload,
    });

    // Assign the updated data to the existing entity
    Object.assign(entity, updatedData);

    // Save the updated entity
    const updatedEntity = await this.usersRepository.save(entity);

    return UserDeviceMapper.toDomain(updatedEntity);
  }

  async softDelete(id: UserDevice['id']): Promise<void> {
    await this.usersRepository.softDelete(id);
  }
}
