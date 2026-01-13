import { Injectable } from '@nestjs/common';
import { PaycodeRepository } from './infrastructure/persistence/paycode.repository';
import { CreatePaycodeDto } from './dto/create-paycode.dto';
import { UpdatePaycodeDto } from './dto/update-paycode.dto';
import { Paycode } from './domain/paycode';
import { PaycodeEntity } from './infrastructure/persistence/relational/entities/paycode.entity';
import { PaycodeType } from './paycodes.enum';

@Injectable()
export class PaycodesService {
  constructor(private readonly repository: PaycodeRepository) {}

  async create(dto: CreatePaycodeDto): Promise<Paycode> {
    return this.repository.create(dto);
  }

  async update(id: Paycode['id'], dto: UpdatePaycodeDto): Promise<Paycode> {
    return this.repository.update(id, dto);
  }

  async findAllByCarrierId(
    carrierId?: string,
    paycodeType?: PaycodeType,
  ): Promise<{ data: Paycode[]; total: number }> {
    return this.repository.findAllByCarrierId(carrierId, paycodeType);
  }

  async findAllByCarrierIdWithCommissions(
    carrierId: string,
  ): Promise<PaycodeEntity[]> {
    return this.repository.findAllByCarrierIdWithCommissions(carrierId);
  }

  findAll(): Promise<any> {
    return this.repository.findAll();
  }

  async findOneById(id: Paycode['id']): Promise<Paycode> {
    return this.repository.findById(id);
  }

  async remove(id: Paycode['id']) {
    await this.repository.delete(id);
  }

  async findByNameAndCarrierId(
    name: string,
    carrierId: string,
  ): Promise<Paycode | null> {
    return this.repository.findByNameAndCarrierId(name, carrierId);
  }
}
