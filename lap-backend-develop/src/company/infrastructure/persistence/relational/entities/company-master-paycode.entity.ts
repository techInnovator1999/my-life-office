// company-master-paycode.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { CompanyEntity } from './company.entity';
import { MasterPaycodeEntity } from '@/master-paycode/infrastructure/persistence/relational/entities/master-paycode.entity';
import { BaseTimestampedEntity } from '@/utils/base-timestamped-entity';
import { CompanyMasterPaycode } from '@/company/domain/company-master-paycode';

@Entity({ name: 'company_master_paycode' })
@Unique(['company', 'masterPaycode']) // avoid duplicates
export class CompanyMasterPaycodeEntity
  extends BaseTimestampedEntity
  implements CompanyMasterPaycode
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CompanyEntity, (company) => company.companyMasterPaycodes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'companyId' })
  company: CompanyEntity;

  @ManyToOne(() => MasterPaycodeEntity, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'masterPaycodeId' })
  masterPaycode: MasterPaycodeEntity;

  @Column({ nullable: true })
  value: string;
}
