import { MasterPaycodeMapping } from '@/master-paycode-mapping/domain/master-paycode-mapping';
import { BaseTimestampedEntity } from '@/utils/base-timestamped-entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { MasterPaycodeEntity } from '@/master-paycode/infrastructure/persistence/relational/entities/master-paycode.entity';
import { PaycodeEntity } from '@/paycodes/infrastructure/persistence/relational/entities/paycode.entity';

@Entity({ name: 'master_paycode_mapping' })
export class MasterPaycodeMappingEntity
  extends BaseTimestampedEntity
  implements MasterPaycodeMapping
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => MasterPaycodeEntity, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  masterPaycode: MasterPaycodeEntity;

  @ManyToOne(() => PaycodeEntity, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  paycode: PaycodeEntity;
}
