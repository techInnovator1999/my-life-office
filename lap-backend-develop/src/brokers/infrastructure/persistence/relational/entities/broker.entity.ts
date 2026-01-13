import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimestampedEntity } from '@/utils/base-timestamped-entity';
import { CarrierEntity } from '@/carriers/infrastructure/persistence/relational/entities/carrier.entity';
import { BrokerStaffEntity } from './broker_staff.entity';
import { Broker } from '@/brokers/domain/broker';
import { BrokerTypeEnum } from '@/brokers/brokers.enum';

@Entity({ name: 'broker' })
export class BrokerEntity extends BaseTimestampedEntity implements Broker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => CarrierEntity, (carrier) => carrier.broker)
  carriers: CarrierEntity[];

  @OneToMany(() => BrokerStaffEntity, (bs) => bs.broker)
  brokerStaff: BrokerStaffEntity[];

  @Column({ type: String, nullable: false })
  name: string;

  @Column({ enum: BrokerTypeEnum })
  brokerType: BrokerTypeEnum;

  @Column({ type: String, nullable: true })
  website: string | null;

  @Column({ type: String, nullable: true })
  address: string | null;

  @Column({ type: String, nullable: true })
  contracting: string | null;

  @Column({ type: String, nullable: true })
  mainContact: string | null;

  @Column({ type: String, nullable: true })
  phoneNumber: string | null;

  @Column({ type: String, nullable: true })
  notes: string | null;
}
