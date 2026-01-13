import { Subscription } from '@/subscriptions/domain/subscription';
import { BaseTimestampedEntity } from '@/utils/base-timestamped-entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'subscription' })
export class SubscriptionEntity
  extends BaseTimestampedEntity
  implements Subscription
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: String, nullable: false })
  name: string;

  @Column({ type: String, nullable: true, default: null })
  description?: string;

  // @OneToMany(
  //   () => ServiceMainEntity,
  //   (serviceMain) => serviceMain.subscription,
  //   {
  //     eager: true,
  //     nullable: false,
  //   },
  // )
  // services: ServiceMainEntity[];
}
