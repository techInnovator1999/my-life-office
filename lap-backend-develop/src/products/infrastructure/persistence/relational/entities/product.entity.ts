import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import {
  ProductRatingEnum,
  ProductRealEnum,
  ProductTierEnum,
  ProductLength,
} from '@/products/products.enum';
import { CarrierEntity } from '@/carriers/infrastructure/persistence/relational/entities/carrier.entity';
import { ServiceSubTypeEntity } from '@/services/infrastructure/persistence/relational/entities/service-sub-type.entity';
import { DepositTypeEntity } from '@/deposit-types/infrastructure/persistence/relational/entities/deposit-type.entity';
import { BaseTimestampedEntity } from '@/utils/base-timestamped-entity';
import { ProductCommissionEntity } from '@/product-commissions/infrastructure/persistence/relational/entities/product-commission.entity';
import { Product } from '@/products/domain/product';

@Entity({ name: 'product' })
// @Unique(['carrier', 'service_sub_type'])
export class ProductEntity extends BaseTimestampedEntity implements Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: String })
  name: string;

  @Index()
  @ManyToOne(() => CarrierEntity, (carrier) => carrier.products, {
    eager: true,
    nullable: false,
  })
  @JoinColumn()
  carrier: CarrierEntity;

  @ManyToOne(
    () => ServiceSubTypeEntity,
    (serviceSubType) => serviceSubType.products,
    {
      eager: true,
      nullable: false,
    },
  )
  @JoinColumn()
  serviceSubType: ServiceSubTypeEntity;

  @ManyToOne(() => DepositTypeEntity, (dt) => dt.products, {
    eager: true,
    nullable: false,
  })
  @JoinColumn()
  depositType: DepositTypeEntity;

  @OneToMany(() => ProductCommissionEntity, (pc) => pc.product, {
    eager: true,
    nullable: false,
    cascade: true,
  })
  @JoinColumn()
  productCommissions: ProductCommissionEntity[];

  @Column({ type: String, nullable: true })
  stateAvailable?: string | null;

  @Column({ type: String, nullable: true })
  subName?: string | null;

  @Column({ type: String, nullable: true })
  productFullName?: string | null;

  @Column({ type: String, nullable: true })
  criteria?: string | null;

  @Column({ type: String, nullable: true })
  notes?: string | null;

  @Column({
    type: 'enum',
    enum: ProductLength,
    array: true,
  })
  lengths: ProductLength[];

  @Column({ type: String, nullable: false })
  serviceMainType: string;

  @Column({ enum: ProductRealEnum, default: ProductRealEnum.TBD })
  productReal: ProductRealEnum;

  @Column({ enum: ProductTierEnum, default: ProductTierEnum.TBD })
  tier: ProductTierEnum;

  @Column({ enum: ProductRatingEnum, default: ProductRatingEnum.ONE })
  rating: ProductRatingEnum;

  @Column({ type: Number, generated: 'increment' })
  orderNo: number;
}
