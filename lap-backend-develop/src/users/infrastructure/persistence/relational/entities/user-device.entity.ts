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
import { UserDevice } from '@/users/domain/user-device';
import { UserDeviceLanguageEnum } from '@/users/users.enum';

@Entity({
  name: 'user-device',
})
export class UserDeviceEntity
  extends EntityRelationalHelper
  implements UserDevice
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.userDevice)
  @JoinColumn()
  user: UserEntity;

  @Column({ type: String })
  deviceId: string;

  @Column({ type: String })
  fcmToken: string;

  @Column({ type: Number, default: UserDeviceLanguageEnum.en })
  language: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
