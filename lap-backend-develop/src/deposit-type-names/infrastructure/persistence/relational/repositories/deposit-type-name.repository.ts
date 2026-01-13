import { InjectRepository } from '@nestjs/typeorm';
import { DepositTypeNameRepository } from '../../deposit-type-name.repository';
import { Repository } from 'typeorm';
import { DepositTypeNameEntity } from '../entities/deposit-type-name.entity';
import { DepositTypeName } from '@/deposit-type-names/domain/deposit-type-name';
import { DepositTypeNameMapper } from '../mappers/deposit-type-name.mapper';

export class DepositTypeNameRelationalRepository
  implements DepositTypeNameRepository
{
  constructor(
    @InjectRepository(DepositTypeNameEntity)
    private readonly depositTypeNameRepository: Repository<DepositTypeNameEntity>,
  ) {}

  async findAll(): Promise<DepositTypeName[]> {
    const names = await this.depositTypeNameRepository.find();
    return names.map((name) => DepositTypeNameMapper.toDomain(name));
  }

  async create(depositTypeName: DepositTypeName): Promise<DepositTypeName> {
    const persistenceModel =
      DepositTypeNameMapper.toPersistence(depositTypeName);
    const entity = await this.depositTypeNameRepository.save(
      this.depositTypeNameRepository.create(persistenceModel),
    );
    return DepositTypeNameMapper.toDomain(entity);
  }

  async delete(id: DepositTypeName['id']): Promise<void> {
    await this.depositTypeNameRepository.delete(id);
  }
}
