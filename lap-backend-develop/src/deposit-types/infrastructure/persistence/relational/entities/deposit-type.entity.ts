import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ServiceMainEntity } from '@/services/infrastructure/persistence/relational/entities/service-main.entity';
import { BaseTimestampedEntity } from '@/utils/base-timestamped-entity';
import { DepositType } from '@/deposit-types/domain/deposit-type';
import { ProductEntity } from '@/products/infrastructure/persistence/relational/entities/product.entity';
import { DepositTypeNameEntity } from '@/deposit-type-names/infrastructure/persistence/relational/entities/deposit-type-name.entity';

@Entity({ name: 'deposit_type' })
export class DepositTypeEntity
  extends BaseTimestampedEntity
  implements DepositType
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column('text', { array: true })
  // names: string[];
  @OneToMany(() => DepositTypeNameEntity, (name) => name.depositType, {
    eager: true,
  })
  names: DepositTypeNameEntity[];

  @Index()
  @ManyToOne(() => ServiceMainEntity, (sm) => sm.depositTypes, {
    eager: true,
    nullable: false,
  })
  @JoinColumn()
  serviceMain: ServiceMainEntity;

  @OneToMany(() => ProductEntity, (product) => product.depositType)
  products: ProductEntity[];
}
