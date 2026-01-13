import { DepositTypeName } from '@/deposit-type-names/domain/deposit-type-name';
import { DepositTypeEntity } from '@/deposit-types/infrastructure/persistence/relational/entities/deposit-type.entity';
import { BaseTimestampedEntity } from '@/utils/base-timestamped-entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'deposit_type_name' })
export class DepositTypeNameEntity
  extends BaseTimestampedEntity
  implements DepositTypeName
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: String, nullable: false, unique: true })
  name: string;

  @ManyToOne(() => DepositTypeEntity, (dt) => dt.names, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  depositType: DepositTypeEntity;
}
