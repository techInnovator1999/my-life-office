import { DepositTypeName } from '@/deposit-type-names/domain/deposit-type-name';
import { DepositTypeNameEntity } from '../entities/deposit-type-name.entity';

export class DepositTypeNameMapper {
  static toDomain(raw: DepositTypeNameEntity): DepositTypeName {
    const dtName = new DepositTypeName();
    dtName.id = raw.id;
    dtName.name = raw.name;
    return dtName;
  }

  static toPersistence(plan: DepositTypeName): DepositTypeNameEntity {
    const dtEntity = new DepositTypeNameEntity();
    dtEntity.name = plan.name;
    return dtEntity;
  }
}
