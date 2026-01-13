import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Email } from './mail.entity';
import { FileEntity } from '@/files/infrastructure/persistence/relational/entities/file.entity';
import { EntityRelationalHelper } from '@/utils/relational-entity-helper';

@Entity()
export class EmailAttachment extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => Email, (email) => email.attachments, {
    onDelete: 'CASCADE',
    eager: true,
  })
  email: Email;

  @ManyToOne(() => FileEntity, (file) => file.emailAttachments, {
    onDelete: 'CASCADE',
    eager: true,
  })
  file: FileEntity;
}
