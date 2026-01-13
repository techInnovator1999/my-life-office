import { DepositTypeName } from '@/deposit-type-names/domain/deposit-type-name';

export abstract class DepositTypeNameRepository {
  abstract findAll(): Promise<DepositTypeName[]>;

  abstract create(
    payload: Omit<
      DepositTypeName,
      'id' | 'createdAt' | 'deletedAt' | 'updatedAt'
    >,
  ): Promise<DepositTypeName>;

  abstract delete(id: DepositTypeName['id']): Promise<void>;
}
