import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '@/utils/relational-entity-helper';
import { EmailNameEnum } from '@/email-template/email-template.enum';
import { EmailTemplate } from '@/email-template/domain/email-template';

@Entity({
  name: 'email-template',
})
@Unique(['name', 'deletedAt'])
export class EmailTemplateEntity
  extends EntityRelationalHelper
  implements EmailTemplate
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: String })
  subject: string;

  @Column({ type: String })
  name: EmailNameEnum;

  @Column({ type: 'json' })
  json: object;

  @Column({ type: String })
  html: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
