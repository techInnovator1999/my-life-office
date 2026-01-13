import { EntityRelationalHelper } from '@/utils/relational-entity-helper';
import { UserEntity } from './user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserSuspension } from '@/users/domain/user-suspension';

@Entity({
  name: 'user-suspension',
})
export class UserSuspensionEntity
  extends EntityRelationalHelper
  implements UserSuspension
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.userSuspensions)
  @JoinColumn()
  user: UserEntity;

  @Column({ type: Date })
  startDate: Date;

  @Column({ type: Date, nullable: true })
  endDate: Date | null;

  @Column({ type: String, nullable: true })
  reason: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
