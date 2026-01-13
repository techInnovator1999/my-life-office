import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseTimestampedEntity } from '@/utils/base-timestamped-entity';
import { Contact } from '@/contacts/domain/contact';
import { ContactType, ContactStatus } from '@/contacts/contacts.enum';
import { UserEntity } from '@/users/infrastructure/persistence/relational/entities/user.entity';

@Entity({ name: 'contact' })
export class ContactEntity extends BaseTimestampedEntity implements Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({
    type: 'enum',
    enum: ContactType,
    default: ContactType.INDIVIDUAL,
  })
  contactType: ContactType;

  // Common fields for Individual and Employee
  @Column({ type: String, nullable: true })
  firstName?: string | null;

  @Column({ type: String, nullable: true })
  lastName?: string | null;

  @Index()
  @Column()
  email: string;

  @Column({ type: String, nullable: true })
  phoneNumber?: string | null; // Mobile

  @Column({ type: String, nullable: true })
  workPhone?: string | null; // Work phone

  @Column({ type: 'timestamp', nullable: true })
  dateOfBirth?: Date | null;

  // Address information
  @Column({ type: String, nullable: true })
  primaryAddress?: string | null;

  @Column({ type: String, nullable: true })
  city?: string | null;

  @Column({ type: String, nullable: true })
  state?: string | null;

  @Column({ type: String, nullable: true })
  zipCode?: string | null;

  // Individual/Employee specific fields
  @Column({ type: String, nullable: true })
  occupation?: string | null;

  @Column({ type: String, nullable: true })
  employer?: string | null;

  @Column({ type: String, nullable: true })
  spouse?: string | null;

  @Column({ type: String, nullable: true })
  ssn?: string | null;

  @Column({ type: String, nullable: true })
  mbiNumber?: string | null;

  // Business specific fields
  @Column({ type: String, nullable: true })
  companyName?: string | null;

  @Column({ type: String, nullable: true })
  industryType?: string | null;

  @Column({ type: String, nullable: true })
  ownerName?: string | null;

  @Column({ type: String, nullable: true })
  ownerTitle?: string | null;

  @Column({ type: String, nullable: true })
  ownerEmail?: string | null;

  @Column({ type: String, nullable: true })
  ownerPhone?: string | null;

  @Column({ type: String, nullable: true })
  otherName?: string | null;

  @Column({ type: String, nullable: true })
  otherTitle?: string | null;

  @Column({ type: String, nullable: true })
  otherEmail?: string | null;

  @Column({ type: String, nullable: true })
  otherPhone?: string | null;

  // Employee specific fields
  @Column({ type: String, nullable: true })
  parentCompany?: string | null;

  // Common notes field
  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  // Source and referral
  @Column({ type: String, nullable: true })
  source?: string | null;

  @Column({ type: String, nullable: true })
  referredBy?: string | null;

  @Index()
  @Column({
    type: 'enum',
    enum: ContactStatus,
    default: ContactStatus.PROSPECT,
  })
  status: ContactStatus;

  @Index()
  @Column({ default: false })
  isLocked: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lockedAt?: Date | null;

  @Column({ type: String, nullable: true })
  lockedBy?: string | null;

  @Index()
  @Column({ default: false })
  isFromGoogle: boolean;

  @Index()
  @Column({ type: String, nullable: true })
  googleContactId?: string | null;

  @Column({ type: 'simple-array', nullable: true, default: '' })
  googleTags: string[];

  @Column({ type: 'timestamp', nullable: true })
  lastSyncedAt?: Date | null;

  @Index()
  @ManyToOne(() => UserEntity, { eager: false, nullable: false })
  @JoinColumn({ name: 'agentId' })
  agent: UserEntity;

  @Column()
  agentId: string;
}

