import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductEntity } from '@/products/infrastructure/persistence/relational/entities/product.entity';
import { BaseTimestampedEntity } from '@/utils/base-timestamped-entity';
import { PaycodeEntity } from '@/paycodes/infrastructure/persistence/relational/entities/paycode.entity';
import { ProductCommission } from '@/product-commissions/domain/product-commission';
import { Exclude } from 'class-transformer';

@Entity({ name: 'product_commission' })
export class ProductCommissionEntity
  extends BaseTimestampedEntity
  implements ProductCommission
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', default: 0 })
  commission: number;

  @Index()
  @ManyToOne(() => ProductEntity, (pd) => pd.productCommissions, {
    nullable: false,
  })
  @JoinColumn()
  @Exclude({ toPlainOnly: true })
  product: ProductEntity;

  @ManyToOne(() => PaycodeEntity, (pc) => pc.productCommissions, {
    nullable: false,
  })
  @JoinColumn()
  paycode: PaycodeEntity;
}
