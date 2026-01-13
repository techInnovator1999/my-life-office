import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  AfterLoad,
  AfterInsert,
  OneToMany,
} from 'typeorm';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import appConfig from '../../../../../config/app.config';
import { AppConfig } from 'src/config/app-config.type';
import { EmailAttachment } from '@/mail/infrastructure/persistence/relational/entities/email-attachment.entity';

@Entity({ name: 'file' })
export class FileEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  path: string;

  @OneToMany(() => EmailAttachment, (emailAttachment) => emailAttachment.file, {
    nullable: true,
  })
  emailAttachments: EmailAttachment[] | null;

  @AfterLoad()
  @AfterInsert()
  updatePath() {
    if (this.path.indexOf('/') === 0) {
      this.path = (appConfig() as AppConfig).backendDomain + this.path;
    }
  }
}
