import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { ServiceMainEntity } from '@/services/infrastructure/persistence/relational/entities/service-main.entity';
import { CarrierLevelEnum, CarrierRatingEnum } from '@/carriers/carriers.enum';
import { PaycodeEntity } from '@/paycodes/infrastructure/persistence/relational/entities/paycode.entity';
import { ProductEntity } from '@/products/infrastructure/persistence/relational/entities/product.entity';
import { BaseTimestampedEntity } from '@/utils/base-timestamped-entity';
import { Carrier } from '@/carriers/domain/carrier';
import { BrokerEntity } from '@/brokers/infrastructure/persistence/relational/entities/broker.entity';

@Entity({ name: 'carrier' })
export class CarrierEntity extends BaseTimestampedEntity implements Carrier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: String, nullable: true })
  city?: string | null;

  @Column({ type: String, nullable: true })
  state?: string | null;

  @Column({ type: String, nullable: true })
  zip?: string | null;

  @Index()
  @ManyToOne(() => ServiceMainEntity, (sm) => sm.carriers, {
    eager: true,
    nullable: false,
  })
  @JoinColumn()
  serviceMain: ServiceMainEntity;

  @Column({ type: String })
  serviceId?: string | null;

  @OneToMany(() => PaycodeEntity, (pc) => pc.carrier)
  paycodes: PaycodeEntity[];

  @OneToMany(() => ProductEntity, (product) => product.carrier)
  products: ProductEntity[];

  @Index()
  @ManyToOne(() => BrokerEntity, (broker) => broker.carriers, {
    eager: true,
    nullable: false,
  })
  broker: BrokerEntity;

  @Column({ type: String, nullable: true })
  fullName?: string | null;

  @Column()
  shortName: string;

  @Column({ type: String, nullable: true })
  initial?: string | null;

  @Column({ type: String, nullable: true })
  logo?: string | null;

  @Column()
  mainAddress: string;

  @Column({ type: String, nullable: true })
  mainPhone?: string | null;

  @Column({ type: String, nullable: true })
  agentSupportPhone?: string | null;

  @Column({ type: String, nullable: true })
  publicUrl?: string | null;

  @Column({ type: String, nullable: true })
  agentUrl?: string | null;

  @Column({ type: String, nullable: true })
  contactNotes: string | null;

  @Column({ type: String, nullable: true })
  emailCommission?: string | null;

  @Column({ type: String, nullable: true })
  emailNewBusiness?: string | null;

  @Column({ type: String, nullable: true })
  adminCutoff?: string | null;

  @Column({ type: String, nullable: true })
  adminReleaseDate?: string | null;

  @Column({ type: String, nullable: true })
  adminMinck?: string | null;

  @Column({ type: String, nullable: true })
  adminMineft?: string | null;

  @Column({ type: String, nullable: true })
  adminCommissionPolicy?: string | null;

  @Column({ type: String, nullable: true })
  adminChargebackSchedule?: string | null;

  @Column({ type: String, nullable: true })
  adminAdvanceCap?: string | null;

  @Column({ type: String, nullable: true })
  adminCommContact?: string | null;

  @Column({ type: String, nullable: true })
  adminOtherNotes?: string | null;

  @Column({ type: 'enum', enum: CarrierLevelEnum })
  level: CarrierLevelEnum;

  @Column({ type: 'enum', enum: CarrierRatingEnum })
  rating: CarrierRatingEnum;
}
