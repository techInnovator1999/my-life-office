import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
} from 'typeorm';
import { BaseTimestampedEntity } from '@/utils/base-timestamped-entity';
import { Region } from '@/region/domain/region';

@Entity({ name: 'region' })
export class RegionEntity
  extends BaseTimestampedEntity
  implements Region
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  label: string;

  @Index()
  @Column({ type: 'varchar', unique: true })
  value: string;

  @Index()
  @Column({ type: 'varchar', length: 2, nullable: true })
  code?: string | null;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Index()
  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}

