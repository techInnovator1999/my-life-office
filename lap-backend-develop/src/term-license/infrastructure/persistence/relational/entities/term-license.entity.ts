import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
} from 'typeorm';
import { BaseTimestampedEntity } from '@/utils/base-timestamped-entity';
import { TermLicense } from '@/term-license/domain/term-license';

@Entity({ name: 'term_license' })
export class TermLicenseEntity
  extends BaseTimestampedEntity
  implements TermLicense
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

