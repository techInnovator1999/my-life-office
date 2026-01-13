import { EntityRelationalHelper } from '@/utils/relational-entity-helper';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { EmailAttachment } from './email-attachment.entity';

@Entity('email')
export class Email extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ type: 'text', nullable: true })
  stack: string;

  @Column({ type: 'text', nullable: true })
  error: string;

  @Column({ type: 'json', nullable: true })
  context: any;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subject: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subjectTemplate: string;

  @Column({ type: 'text', nullable: true })
  body: string;

  @Column({ type: 'text', nullable: true })
  bodyTemplate: string;

  @Column({ name: 'text', type: 'varchar', length: 255, nullable: true }) // Column name is 'text'
  text: string;

  @Column({ type: 'text', nullable: true })
  to: string;

  @Column({ type: 'json', nullable: true })
  from: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cc: string;

  @Column({ type: 'timestamp', nullable: true })
  sentAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  failedAt: Date;

  @OneToMany(
    () => EmailAttachment,
    (emailAttachment) => emailAttachment.email,
    { nullable: true },
  )
  attachments: EmailAttachment[] | null;

  constructor(emailData: Partial<Email>) {
    super();
    Object.assign(this, emailData);
  }
}
