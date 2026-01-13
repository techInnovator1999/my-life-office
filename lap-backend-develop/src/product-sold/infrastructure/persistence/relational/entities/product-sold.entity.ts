import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
} from 'typeorm';
import { BaseTimestampedEntity } from '@/utils/base-timestamped-entity';
import { ProductSold } from '@/product-sold/domain/product-sold';

@Entity({ name: 'product_sold' })
export class ProductSoldEntity
  extends BaseTimestampedEntity
  implements ProductSold
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  label: string;

  @Index()
  @Column({ type: 'varchar', unique: true })
  value: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Index()
  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}

