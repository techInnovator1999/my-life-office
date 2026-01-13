import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ServiceMainEntity } from './service-main.entity';
import { BaseTimestampedEntity } from '@/utils/base-timestamped-entity';
import { ServiceSubType } from '@/services/domain/service-sub-type';
import { ProductEntity } from '@/products/infrastructure/persistence/relational/entities/product.entity';

@Entity({ name: 'service_sub_type' })
export class ServiceSubTypeEntity
  extends BaseTimestampedEntity
  implements ServiceSubType
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Index()
  @ManyToOne(
    () => ServiceMainEntity,
    (serviceMain) => serviceMain.serviceSubTypes,
    { eager: true, nullable: false },
  )
  serviceMain: ServiceMainEntity;

  @OneToMany(() => ProductEntity, (product) => product.serviceSubType)
  products: ProductEntity[];
}
