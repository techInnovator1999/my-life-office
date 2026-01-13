import { Company } from './company';
import { MasterPaycode } from '@/master-paycode/domain/master-paycode';

export class CompanyMasterPaycode {
  id: string;

  // Relations
  company?: Company;
  masterPaycode?: MasterPaycode;

  // Business attributes
  value?: string | null;
}
