import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BrokerEntity } from './broker.entity';
import { BaseTimestampedEntity } from '@/utils/base-timestamped-entity';
import { BrokerStaff } from '@/brokers/domain/broker_staff';

@Entity({ name: 'broker_staff' })
export class BrokerStaffEntity
  extends BaseTimestampedEntity
  implements BrokerStaff
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  title: string;

  @Column()
  email: string;

  @Index()
  @ManyToOne(() => BrokerEntity, (broker) => broker.brokerStaff, {
    nullable: false,
  })
  broker: BrokerEntity;
}
