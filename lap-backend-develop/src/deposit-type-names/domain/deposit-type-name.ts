import { DepositType } from '@/deposit-types/domain/deposit-type';

export class DepositTypeName {
  id: string;
  name: string;
  depositType: DepositType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
