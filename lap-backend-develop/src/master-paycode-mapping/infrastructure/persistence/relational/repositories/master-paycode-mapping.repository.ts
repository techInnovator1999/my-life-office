// company-product-commission.relational.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { MasterPaycodeMappingRepository } from '../../master-paycode-mapping.repository';
import { NullableType } from '@/utils/types/nullable.type';
import { PaycodeGridResponseDto } from '@/master-paycode-mapping/dto/paycode-grid-response.dto';
import { plainToInstance } from 'class-transformer';
import { MasterPaycodeMapping } from '@/master-paycode-mapping/domain/master-paycode-mapping';
import { MasterPaycodeMappingEntity } from '../entities/master-paycode-mapping.entity';
import { MasterPaycodeMappingMapper } from '../mappers/master-paycode-mapping.mapper';

@Injectable()
export class RelationalMasterPaycodeMappingRepository
  implements MasterPaycodeMappingRepository
{
  constructor(
    @InjectRepository(MasterPaycodeMappingEntity)
    private readonly repo: Repository<MasterPaycodeMappingEntity>,
  ) {}

  async create(entity: MasterPaycodeMapping): Promise<MasterPaycodeMapping> {
    const persistenceModel = MasterPaycodeMappingMapper.toPersistance(entity);
    const newEntity = await this.repo.save(persistenceModel);
    return MasterPaycodeMappingMapper.toDomain(newEntity);
  }

  async update(
    id: MasterPaycodeMapping['id'],
    payload: Partial<MasterPaycodeMapping>,
  ): Promise<MasterPaycodeMapping> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['paycode', 'paycode.productCommissions'],
    });

    if (!entity) {
      throw new NotFoundException('Master Paycode Mapping not found');
    }

    const domain = MasterPaycodeMappingMapper.toDomain(entity);
    const updated = {
      ...domain,
      ...payload,
    };
    Object.assign(entity, MasterPaycodeMappingMapper.toPersistance(updated));
    const updatedEntity = await this.repo.save(entity);

    return MasterPaycodeMappingMapper.toDomain(updatedEntity);
  }

  async getCommissionGrid(
    carrierId: string,
    companyId?: string,
  ): Promise<PaycodeGridResponseDto[]> {
    const query = this.repo
      .createQueryBuilder('cac')
      .leftJoinAndSelect('cac.masterPaycode', 'masterPaycode')
      .leftJoinAndSelect('cac.paycode', 'paycode')
      .leftJoinAndSelect('paycode.productCommissions', 'productCommission')
      .leftJoinAndSelect('productCommission.product', 'product')
      .leftJoin('paycode.carrier', 'carrier')
      .where('carrier.id = :carrierId', { carrierId })
      .addOrderBy('masterPaycode.createdAt', 'ASC')
      .addOrderBy('product.createdAt', 'ASC')
      .addOrderBy('productCommission.createdAt', 'ASC');

    if (companyId) {
      query.leftJoinAndMapOne(
        'masterPaycode.companyMasterPaycode',
        'company_master_paycode',
        'companyMasterPaycode',
        'companyMasterPaycode.masterPaycodeId = masterPaycode.id AND companyMasterPaycode.companyId = :companyId',
        { companyId },
      );
    }

    const gridResponse = await query.getMany();
    console.log('gridResponse', gridResponse);

    return plainToInstance(PaycodeGridResponseDto, gridResponse, {
      excludeExtraneousValues: true,
    });
  }

  async findByCarrierId(carrierId: string): Promise<MasterPaycodeMapping[]> {
    const entities = await this.repo.find({
      where: { paycode: { carrier: { id: carrierId } } },
      relations: ['masterPaycode', 'paycode'],
    });

    return entities.map((entity) =>
      MasterPaycodeMappingMapper.toDomain(entity),
    );
  }

  async findOneById(
    id: MasterPaycodeMapping['id'],
  ): Promise<NullableType<MasterPaycodeMapping>> {
    const entity = await this.repo.findOne({
      where: { id },
    });

    return entity ? MasterPaycodeMappingMapper.toDomain(entity) : null;
  }

  async findOneBy(
    where: FindOptionsWhere<MasterPaycodeMappingEntity>,
  ): Promise<NullableType<MasterPaycodeMapping>> {
    const entity = await this.repo.findOneBy(where);
    return entity ? MasterPaycodeMappingMapper.toDomain(entity) : null;
  }

  async findOne(
    where: FindOneOptions<MasterPaycodeMappingEntity>,
  ): Promise<NullableType<MasterPaycodeMapping>> {
    const entity = await this.repo.findOne(where);
    return entity ? MasterPaycodeMappingMapper.toDomain(entity) : null;
  }

  async find(
    options: FindManyOptions<MasterPaycodeMappingEntity>,
  ): Promise<MasterPaycodeMapping[]> {
    const entities = await this.repo.find(options);
    return entities.map((entity) =>
      MasterPaycodeMappingMapper.toDomain(entity),
    );
  }

  async remove(masterPaycodeId: string, paycodeId: string): Promise<void> {
    const entity = await this.repo.findOne({
      where: {
        masterPaycode: { id: masterPaycodeId },
        paycode: { id: paycodeId },
      },
    });

    if (!entity) {
      throw new NotFoundException('Master Paycode Mapping not found');
    }

    await this.repo.remove(entity);
  }

  async removeAll(
    entries: { masterPaycodeId: string; paycodeId: string }[],
  ): Promise<void> {
    const entities = await this.repo.find({
      where: entries.map((e) => ({
        masterPaycode: { id: e.masterPaycodeId },
        paycode: { id: e.paycodeId },
      })),
    });

    if (!entities.length) {
      throw new NotFoundException('Master Paycode Mapping(s) not found');
    }

    await this.repo.remove(entities);
  }
}
