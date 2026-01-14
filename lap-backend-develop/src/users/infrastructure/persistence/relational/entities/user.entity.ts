import {
  Column,
  AfterLoad,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { RoleEntity } from '@/roles/infrastructure/persistence/relational/entities/role.entity';
import { StatusEntity } from '@/statuses/infrastructure/persistence/relational/entities/status.entity';
import { FileEntity } from '@/files/infrastructure/persistence/relational/entities/file.entity';
import { EntityRelationalHelper } from '@/utils/relational-entity-helper';
import { AuthProvidersEnum } from '@/auth/auth-providers.enum';
import { Exclude, Expose } from 'class-transformer';
import { User } from '@/users/domain/user';
import { AccountNotificationEntity } from '@/account_notification/persistence/relational/entities/account-notification.entity';
import { UserDeviceEntity } from './user-device.entity';
import { UserPreferenceEntity } from './user-preference.entity';
import { AccountManagerEntity } from '@/account-manager/persistence/relational/entities/account-manager.entity';
import { UserSuspensionEntity } from './user-suspension.entity';
import { RegistrationTypeEnum } from '@/auth/registration-type.enum';

@Entity({
  name: 'user',
})
@Unique(['role', 'email'])
export class UserEntity extends EntityRelationalHelper implements User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: String, nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  email: string | null;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password?: string;

  @Exclude({ toPlainOnly: true })
  public previousPassword?: string;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @Column({ default: AuthProvidersEnum.email })
  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @Index()
  @Column({ type: String, nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  socialId?: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  firstName?: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  lastName?: string | null;

  @Column({ type: String, nullable: true })
  metaData?: string | null;

  @Column({ type: String, nullable: true })
  reference_code?: string | null;

  @Column({ type: String, nullable: true })
  defaultPromoCode?: string | null;

  @ManyToOne(() => FileEntity, { eager: true })
  photo?: FileEntity | null;

  @ManyToOne(() => RoleEntity, { eager: true })
  role?: RoleEntity | null;

  @ManyToOne(() => StatusEntity, { eager: true })
  status?: StatusEntity;

  plans: any[];

  @Column({ type: Date, nullable: true })
  lastLogin?: Date | null;

  @Column({ type: Date, nullable: true })
  rejectedAt?: Date | null;

  @Column({ type: Date, nullable: true })
  approvedAt?: Date | null;

  @Column({ type: Date, nullable: true })
  waitingApprovalAt?: Date | null;

  @Column({ type: Date, nullable: true })
  archivedAt?: Date | null;

  @Column({ type: Boolean, nullable: true, default: false })
  isShowToolTip?: boolean | null;

  @OneToMany(
    () => AccountNotificationEntity,
    (accountNotification) => accountNotification.user,
    {
      eager: false,
    },
  )
  accountNotifications: AccountNotificationEntity[];

  @OneToMany(() => UserDeviceEntity, (userDevice) => userDevice.user, {
    eager: false,
  })
  userDevice: UserDeviceEntity[];

  @OneToOne(() => AccountManagerEntity, (accountManager) => accountManager.user)
  accountManager: AccountManagerEntity;

  @OneToMany(
    () => UserPreferenceEntity,
    (userPreference) => userPreference.user,
    {
      eager: false,
    },
  )
  userPreference: UserPreferenceEntity[];

  @Column({ type: Boolean, default: false })
  isApproved: boolean = false;

  @Column({ type: String, nullable: true })
  accountManagerStatus?: string | null;

  @Column({ type: String, nullable: true })
  verificationCode: string | null | undefined;

  @Column({ type: Date, nullable: true })
  verificationExpires: Date | null | undefined;

  @Column({ type: String, nullable: true })
  heardBy?: string | null;

  @Column({ type: String, nullable: true })
  referralName?: string | null;

  @Column({ type: Date, nullable: true })
  deactivatedAt?: Date | null;

  @Column({ type: String, nullable: true })
  deactivatedReason?: string | null;

  @OneToMany(
    () => UserSuspensionEntity,
    (userSuspension) => userSuspension.user,
    {
      eager: false,
    },
  )
  userSuspensions: UserSuspensionEntity[];

  // CRM-specific fields
  @Column({ type: String, nullable: true })
  mobile?: string | null;

  @Column({
    type: 'enum',
    enum: RegistrationTypeEnum,
    nullable: true,
  })
  registrationType?: RegistrationTypeEnum | null;

  @Column({ type: String, nullable: true })
  primaryLicenseType?: string | null;

  @Column({ type: String, nullable: true })
  residentState?: string | null;

  @Column({ type: String, nullable: true })
  licenseNumber?: string | null;

  @Column({ type: 'int', nullable: true })
  yearsLicensed?: number | null;

  @Column({ type: String, nullable: true })
  priorProductsSold?: string | null;

  @Column({ type: String, nullable: true })
  currentCompany?: string | null;

  @Column({ type: String, nullable: true })
  googleAccessToken?: string | null;

  @Column({ type: String, nullable: true })
  googleRefreshToken?: string | null;

  @Column({ type: Date, nullable: true })
  googleTokenExpiry?: Date | null;

  @Column({ type: Date, nullable: true })
  lastGoogleSyncAt?: Date | null;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  sponsoringAgent?: UserEntity | null;

  @Column({ type: 'uuid', nullable: true })
  sponsoringAgentId?: string | null;

  @Column({ type: Boolean, default: false })
  crmAgent: boolean = false;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
