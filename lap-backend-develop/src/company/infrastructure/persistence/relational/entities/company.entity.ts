import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BaseTimestampedEntity } from '@/utils/base-timestamped-entity';
import { Company } from '@/company/domain/company';
import { CompanyMasterPaycodeEntity } from './company-master-paycode.entity';

@Entity({ name: 'company' })
export class CompanyEntity extends BaseTimestampedEntity implements Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => CompanyMasterPaycodeEntity, (cml) => cml.company, {
    eager: true,
    onDelete: 'CASCADE',
  })
  companyMasterPaycodes: CompanyMasterPaycodeEntity[];
}
