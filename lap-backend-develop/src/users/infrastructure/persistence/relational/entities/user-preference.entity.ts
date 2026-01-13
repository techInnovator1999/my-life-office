import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '@/utils/relational-entity-helper';
import { UserEntity } from './user.entity';
import { UserPreference } from '@/users/domain/user-preference';

@Entity({
  name: 'user-preference',
})
export class UserPreferenceEntity
  extends EntityRelationalHelper
  implements UserPreference
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.userPreference)
  @JoinColumn()
  user: UserEntity;

  @Column({ type: Boolean, default: true })
  isPushNotificationEnabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
