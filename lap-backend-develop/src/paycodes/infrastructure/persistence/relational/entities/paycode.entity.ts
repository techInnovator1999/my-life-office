import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CarrierEntity } from '@/carriers/infrastructure/persistence/relational/entities/carrier.entity';
import { BaseTimestampedEntity } from '@/utils/base-timestamped-entity';
import { ProductCommissionEntity } from '@/product-commissions/infrastructure/persistence/relational/entities/product-commission.entity';
import { Paycode } from '@/paycodes/domain/paycode';
import { Exclude } from 'class-transformer';
import { PaycodeType } from '@/paycodes/paycodes.enum';

@Entity({ name: 'paycode' })
export class PaycodeEntity extends BaseTimestampedEntity implements Paycode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: PaycodeType, default: PaycodeType.VENDOR })
  type: PaycodeType;

  @Index()
  @Exclude({ toPlainOnly: true })
  @ManyToOne(() => CarrierEntity, (c) => c.paycodes, {
    nullable: false,
  })
  @JoinColumn()
  carrier: CarrierEntity;

  @Column({ type: 'varchar' })
  name: string;

  @OneToMany(() => ProductCommissionEntity, (pc) => pc.paycode, { eager: true })
  productCommissions: ProductCommissionEntity[];
}
