import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaycodeEntity } from '../entities/paycode.entity';
import { CarrierEntity } from '@/carriers/infrastructure/persistence/relational/entities/carrier.entity';
import { Paycode } from '@/paycodes/domain/paycode';
import { PaycodeMapper } from '../mappers/paycode.mapper';
import { PaycodeType } from '@/paycodes/paycodes.enum';

@Injectable()
export class PaycodeRelationalRepository {
  constructor(
    @InjectRepository(PaycodeEntity)
    private readonly paycodeRepo: Repository<PaycodeEntity>,
  ) {}

  async create(payload: Paycode): Promise<Paycode> {
    const newEntity = await this.paycodeRepo.save(
      this.paycodeRepo.create({
        name: payload.name,
        carrier: { id: payload.carrier.id } as CarrierEntity,
        type: payload.type,
      }),
    );
    return PaycodeMapper.toDomain(newEntity);
  }

  async softDelete(id: Paycode['id']): Promise<void> {
    await this.paycodeRepo.softDelete(id);
  }

  async delete(id: Paycode['id']): Promise<void> {
    await this.paycodeRepo.delete(id);
  }

  async findById(id: Paycode['id']): Promise<Paycode> {
    const entity = await this.paycodeRepo.findOne({
      where: { id },
      relations: {
        carrier: true,
        productCommissions: true,
      },
    });
    if (!entity) {
      throw new NotFoundException(`Paycode with id ${id} not found`);
    }
    return PaycodeMapper.toDomain(entity);
  }

  async findByName(name: string): Promise<Paycode> {
    const entity = await this.paycodeRepo.findOne({
      where: { name },
      relations: {
        carrier: true,
      },
    });
    if (!entity) {
      throw new NotFoundException(`Paycode with name ${name} not found`);
    }
    return PaycodeMapper.toDomain(entity);
  }

  async update(id: Paycode['id'], params: Partial<Paycode>) {
    const entity = await this.paycodeRepo.findOne({
      where: { id },
      relations: {
        carrier: true,
      },
    });
    if (!entity) {
      throw new NotFoundException(`Paycode with id ${id} not found`);
    }
    const updatedData = PaycodeMapper.toPersistence({
      ...PaycodeMapper.toDomain(entity),
      ...params,
    });
    Object.assign(entity, updatedData);
    const savedEntity = await this.paycodeRepo.save(entity);
    return PaycodeMapper.toDomain(savedEntity);
  }

  async findAll(): Promise<{ data: Paycode[]; total: number }> {
    const [entities, total] = await this.paycodeRepo.findAndCount();

    return {
      data: entities.map((entity) => PaycodeMapper.toDomain(entity)),
      total,
    };
  }

  async findAllByCarrierId(
    carrierId?: string,
    type: PaycodeType = PaycodeType.VENDOR,
  ): Promise<{ data: Paycode[]; total: number }> {
    const whereCondition = {};
    whereCondition['type'] = type;
    if (carrierId) {
      whereCondition['carrier'] = { id: carrierId };
    }

    const [entities, count] = await this.paycodeRepo.findAndCount({
      where: whereCondition,
      relations: {
        carrier: true,
        productCommissions: true,
      },
    });

    return {
      data: entities.map((entity) => PaycodeMapper.toDomain(entity)),
      total: count,
    };
  }

  async findAllByCarrierIdWithCommissions(
    carrierId: string,
  ): Promise<PaycodeEntity[]> {
    return this.paycodeRepo
      .createQueryBuilder('paycode')
      .leftJoinAndSelect('paycode.productCommissions', 'productCommission')
      .leftJoinAndSelect('productCommission.product', 'product')
      .where('paycode.carrierId = :carrierId', { carrierId })
      .orderBy('paycode.createdAt', 'ASC')
      .addOrderBy('productCommission.createdAt', 'ASC')
      .addOrderBy('product.createdAt', 'ASC')
      .getMany();
  }

  async findByNameAndCarrierId(
    name: string,
    carrierId: string,
  ): Promise<Paycode | null> {
    const entity = await this.paycodeRepo.findOne({
      where: {
        name,
        carrier: { id: carrierId },
      },
      relations: {
        productCommissions: true,
      },
    });
    // if (!entity) {
    //   throw new NotFoundException(`Paycode not found`);
    // }
    return entity ? PaycodeMapper.toDomain(entity) : null;
  }
}
