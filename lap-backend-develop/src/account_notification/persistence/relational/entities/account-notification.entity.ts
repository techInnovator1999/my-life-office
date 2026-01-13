import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '@/users/infrastructure/persistence/relational/entities/user.entity';

import { EntityRelationalHelper } from '@/utils/relational-entity-helper';
import { AccountNotification } from '@/account_notification/domain/account-notification';

@Entity('account_notification')
export class AccountNotificationEntity
  extends EntityRelationalHelper
  implements AccountNotification
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: Boolean,
  })
  isRead: boolean;

  @Column({
    name: 'title_key',
  })
  titleKey: string;

  @Column({
    name: 'body_key',
  })
  bodyKey: string;

  @Column({
    type: String,
    nullable: true,
  })
  entityId?: string | null;

  @Column({
    type: Number,
  })
  type: number;

  @Column({
    type: String,
  })
  data: string;

  @Column({
    type: String,
  })
  placeHolderData: string;

  @ManyToOne(() => UserEntity, (user) => user.accountNotifications)
  @JoinColumn()
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
