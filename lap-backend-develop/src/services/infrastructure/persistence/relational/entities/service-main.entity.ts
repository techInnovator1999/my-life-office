import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
} from 'typeorm';
import { ServiceSubTypeEntity } from './service-sub-type.entity';
import { BaseTimestampedEntity } from '@/utils/base-timestamped-entity';
import { CarrierEntity } from '@/carriers/infrastructure/persistence/relational/entities/carrier.entity';
import { DepositTypeEntity } from '@/deposit-types/infrastructure/persistence/relational/entities/deposit-type.entity';
import { ServiceMain } from '@/services/domain/service-main';

@Entity({ name: 'service_main' })
export class ServiceMainEntity
  extends BaseTimestampedEntity
  implements ServiceMain
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: String, nullable: false })
  name: string;

  @Column({ type: String, nullable: true })
  shortName?: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => ServiceSubTypeEntity, (subtype) => subtype.serviceMain)
  serviceSubTypes: ServiceSubTypeEntity[];

  @OneToMany(() => DepositTypeEntity, (dt) => dt.serviceMain)
  depositTypes: DepositTypeEntity[];

  @OneToMany(() => CarrierEntity, (carrier) => carrier.serviceMain)
  carriers: CarrierEntity[];
}
