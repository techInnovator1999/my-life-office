import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
} from 'typeorm';
import { BaseTimestampedEntity } from '@/utils/base-timestamped-entity';
import { LicenseType } from '@/license-type/domain/license-type';

@Entity({ name: 'license_type' })
export class LicenseTypeEntity
  extends BaseTimestampedEntity
  implements LicenseType
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

