import { Paycode } from '@/paycodes/domain/paycode';
import { PaycodeEntity } from './relational/entities/paycode.entity';
import { FilterPaycodeDto } from '@/paycodes/dto/query-paycode.dto';
import { DeepPartial } from 'typeorm';
import { PaycodeType } from '@/paycodes/paycodes.enum';

export abstract class PaycodeRepository {
  abstract create(
    data: Omit<
      Paycode,
      'id' | 'createdAt' | 'deletedAt' | 'updatedAt' | 'carrier'
    >,
  ): Promise<Paycode>;

  abstract findById(id: Paycode['id']): Promise<PaycodeEntity>;

  abstract update(
    id: Paycode['id'],
    payload: DeepPartial<Paycode>,
  ): Promise<Paycode>;

  abstract findAllByCarrierId(
    carrierId?: string,
    type?: PaycodeType,
  ): Promise<{ data: Paycode[]; total: number }>;

  abstract softDelete(id: Paycode['id']): Promise<void>;

  abstract findAll(): Promise<any>;

  abstract delete(id: Paycode['id']): Promise<void>;

  abstract findManyWithPagination({
    filterOptions,
    // id,
    // sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterPaycodeDto | null;
    // id?: string | null;
    // sortOptions?: SortPaycodeDto | null;
    paginationOptions: {
      page: number;
      limit: number;
    };
  }): Promise<{ total: number; data: PaycodeEntity[] }>;

  abstract findByNameAndCarrierId(
    name: string,
    carrierId: string,
  ): Promise<Paycode | null>;

  abstract findByName(name: string): Promise<PaycodeEntity>;

  abstract findAllByCarrierIdWithCommissions(
    carrierId: string,
  ): Promise<PaycodeEntity[]>;
}
