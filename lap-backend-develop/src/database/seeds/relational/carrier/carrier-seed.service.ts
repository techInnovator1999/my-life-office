import { CarrierEntity } from '@/carriers/infrastructure/persistence/relational/entities/carrier.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CarrierSeedRow } from './carrier-seed-row.interface';
import { CarrierSeedMapper } from './carrier-seed.mapper';

@Injectable()
export class CarrierSeedService {
  constructor(
    @InjectRepository(CarrierEntity)
    private readonly carrierRepo: Repository<CarrierEntity>,
  ) {}

  async run() {
    const count = await this.carrierRepo.count();
    console.log('Total carrier count is: ', count);
  }

  async findOneBy(params: FindOptionsWhere<CarrierEntity>) {
    const findOptionsWhere: FindOptionsWhere<CarrierEntity> = {};
    Object.keys(params).forEach((key) => {
      findOptionsWhere[key] = params[key];
    });
    return this.carrierRepo.findOneBy(findOptionsWhere);
  }

  async seedFromRows(
    rows: CarrierSeedRow[],
    serviceMainId: string,
    brokerId: string,
  ) {
    const serviceMain = { id: serviceMainId };
    const broker = { id: brokerId };
    for (const carrierRow of rows) {
      const carrierData = CarrierSeedMapper.toEntity(
        carrierRow,
        serviceMain,
        broker,
      );

      const existing = await this.carrierRepo.findOneBy({
        fullName: carrierData.fullName ?? undefined,
      });

      if (!existing) {
        const entity = this.carrierRepo.create(carrierData);
        const savedCarrier = await this.carrierRepo.save(entity);
        console.log(`✅ Created Carrier: `, savedCarrier.serviceId);
      } else {
        console.log(`⚠️ Skipped (Already Exists): ${carrierData.fullName}`);
      }
    }
  }
}
