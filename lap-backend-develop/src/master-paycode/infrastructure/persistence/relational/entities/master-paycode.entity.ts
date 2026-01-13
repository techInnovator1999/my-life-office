import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BaseTimestampedEntity } from '@/utils/base-timestamped-entity';
import { MasterPaycode } from '../../../../domain/master-paycode';
import { MasterPaycodeMappingEntity } from '@/master-paycode-mapping/infrastructure/persistence/relational/entities/master-paycode-mapping.entity';

@Entity({ name: 'master_paycode' })
export class MasterPaycodeEntity
  extends BaseTimestampedEntity
  implements MasterPaycode
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: String })
  name: string;

  @Column({ type: 'int', generated: 'increment', unique: true })
  serial: number;

  @Column({ type: 'decimal', default: 0 })
  percentage: number;

  @OneToMany(() => MasterPaycodeMappingEntity, (cac) => cac.masterPaycode)
  masterPaycodeMappings: MasterPaycodeMappingEntity[];
}
