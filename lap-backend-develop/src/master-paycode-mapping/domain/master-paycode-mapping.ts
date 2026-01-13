import { MasterPaycode } from '@/master-paycode/domain/master-paycode';
import { Paycode } from '@/paycodes/domain/paycode';

export class MasterPaycodeMapping {
  id: string;
  masterPaycode: MasterPaycode;
  paycode: Paycode;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
