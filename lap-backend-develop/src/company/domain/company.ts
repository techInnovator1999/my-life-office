import { CompanyMasterPaycode } from './company-master-paycode';

export class Company {
  id: string;
  name: string;
  companyMasterPaycodes: CompanyMasterPaycode[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
