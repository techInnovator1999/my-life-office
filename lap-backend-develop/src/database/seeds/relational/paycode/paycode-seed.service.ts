import { Injectable } from '@nestjs/common';
import { Paycode } from '@/paycodes/domain/paycode';
import { CarrierEntity } from '@/carriers/infrastructure/persistence/relational/entities/carrier.entity';
import { PaycodeEntity } from '@/paycodes/infrastructure/persistence/relational/entities/paycode.entity';
import { CarrierSeedRow } from '../carrier/carrier-seed-row.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PaycodeSeedService {
  constructor(
    @InjectRepository(PaycodeEntity)
    private readonly paycodeRepo: Repository<PaycodeEntity>,
    @InjectRepository(CarrierEntity)
    private readonly carrierRepo: Repository<CarrierEntity>,
  ) {}

  // method to create paycode from name & carrerId

  async create(name: string, carrierId: string): Promise<PaycodeEntity> {
    const paycode = new Paycode();
    paycode.name = name.trim();
    paycode.carrier = { id: carrierId } as CarrierEntity;
    const entity = this.paycodeRepo.create(paycode);
    const savedEntity = await this.paycodeRepo.save(entity);
    return savedEntity;
  }

  async createMany(rows: CarrierSeedRow[]) {
    for (const carrierRow of rows) {
      // ✅ Get paycodes
      const paycodeRow = carrierRow['Paycode'];
      const serviceId = carrierRow['Service-Carrier ID'];

      if (!paycodeRow) {
        console.log(`⚠️ Skipped (No Paycodes): ${serviceId}`);
        continue;
      }
      const paycodes = paycodeRow.split(',');
      if (!paycodes.length) {
        console.log(`⚠️ Skipped (No Paycodes): ${serviceId}`);
        continue;
      }

      const savedCarrier = await this.carrierRepo.findOneBy({
        serviceId, // ensure serviceId is unique
      });
      if (!savedCarrier) {
        console.log(`⚠️ Skipped (No Carrier): ${serviceId}`);
        continue;
      }

      for (const [index, code] of paycodes.entries()) {
        console.log(`Inserting paycode index: ${index} code: ${code}`);
        await this.create(code, savedCarrier.id);
      }
    }
  }
}
