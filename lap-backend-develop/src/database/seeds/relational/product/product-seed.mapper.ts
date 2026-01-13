import { ProductSeedRow } from './product-seed-row.interface';
import { ProductEntity } from '@/products/infrastructure/persistence/relational/entities/product.entity';
import { CarrierEntity } from '@/carriers/infrastructure/persistence/relational/entities/carrier.entity';
import { ServiceSubTypeEntity } from '@/services/infrastructure/persistence/relational/entities/service-sub-type.entity';
import { DepositTypeEntity } from '@/deposit-types/infrastructure/persistence/relational/entities/deposit-type.entity';
import {
  ProductRealEnum,
  ProductTierEnum,
  ProductRatingEnum,
  ProductLength,
} from '@/products/products.enum';

export class ProductSeedMapper {
  static toEntity(params: {
    row: ProductSeedRow;
    carrier: CarrierEntity;
    subType: ServiceSubTypeEntity;
    depositType: DepositTypeEntity;
  }): ProductEntity {
    const { row, carrier, subType, depositType } = params;

    const entity = new ProductEntity();

    // Assign relational entities
    entity.carrier = carrier;
    entity.serviceSubType = subType;
    entity.depositType = depositType;

    // Simple mappings from row
    entity.productFullName = row['Product Name Full'];
    entity.subName = row['Sub-Name'] ?? null;
    entity.name =
      row['Old Product name'] ?? row['Product Name Full'] ?? row['Product'];
    entity.stateAvailable = row['State Available'];
    entity.criteria = row.Criteria;
    entity.notes = row.Notes ?? null;
    entity.serviceMainType = row['Types'] ?? 'TBD';
    // Order No will be auto-incremented
    // entity.orderNo = row['Order No'] ?? orderNo;

    // Enums or mapped values
    entity.rating =
      (row['Rating'] as ProductRatingEnum) ?? ProductRatingEnum.FIVE;
    entity.tier = row['Product Tier'] as ProductTierEnum;
    entity.productReal = row['Product Real'] as ProductRealEnum;
    entity.lengths = ProductSeedMapper.parseLengthToArray(row.Length);

    return entity;
  }

  static parseLengthToArray(
    value: string | number | null | undefined,
  ): ProductLength[] {
    if (!value) return [ProductLength.OTHER];

    const rawValues: string[] =
      typeof value === 'string'
        ? value.split(',').map((v) => v.trim())
        : [value.toString()];

    const enumValues = Object.values(ProductLength);

    const validLengths = rawValues
      .filter((val): val is ProductLength =>
        enumValues.includes(val as ProductLength),
      )
      .map((val) => val);

    return validLengths.length > 0 ? validLengths : [ProductLength.OTHER];
  }
}
