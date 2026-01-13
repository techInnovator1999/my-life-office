import { CarrierSeedRow } from './carrier-seed-row.interface';
import { CarrierEntity } from '@/carriers/infrastructure/persistence/relational/entities/carrier.entity';
import { CarrierLevelEnum, CarrierRatingEnum } from '@/carriers/carriers.enum';

export class CarrierSeedMapper {
  static toEntity(
    row: CarrierSeedRow,
    serviceMain: any,
    broker: any,
  ): Partial<CarrierEntity> {
    return {
      serviceId: row['Service-Carrier ID'],
      fullName: row['Full Name'] || null,
      shortName: row['Short Carrier Name'] || row['Service-Carrier ID'],
      initial: row['Carrier Initial'] || null,
      mainAddress: row['Main Address'] || 'TBD',
      city: row.City || null,
      state: row.State || null,
      zip: row.Zip?.toString() || null,
      mainPhone: row['Main Phone'] || null,
      publicUrl: row['Public URL'] || null,
      agentUrl: row['Agent URL'] || null,
      adminCutoff: row['Admin Cutoff'] || null,
      adminReleaseDate: row['Admin Release Date'] || null,
      adminMinck: row['Admin Min CK']?.toString() || null,
      adminMineft: row['Admin Min EFT']?.toString() || null,
      adminCommissionPolicy: row['Admin Commission Policy'] || null,
      adminChargebackSchedule: row['Admin Chargeback Schedule'] || null,
      adminAdvanceCap: row['Admin Advance Cap'] || null,
      adminCommContact: row['Admin Comm Contact'] || null,
      level: (row.Level as CarrierLevelEnum) || CarrierLevelEnum.HIDE,
      rating: (row.Rating as CarrierRatingEnum) || CarrierRatingEnum.ZERO,
      serviceMain,
      broker,
    };
  }
}
