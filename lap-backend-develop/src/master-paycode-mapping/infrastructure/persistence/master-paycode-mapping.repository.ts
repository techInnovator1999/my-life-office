import { MasterPaycodeMapping } from '@/master-paycode-mapping/domain/master-paycode-mapping';
import { MasterPaycodeMappingEntity } from './relational/entities/master-paycode-mapping.entity';
import { NullableType } from '@/utils/types/nullable.type';
import { FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { PaycodeGridResponseDto } from '@/master-paycode-mapping/dto/paycode-grid-response.dto';

export abstract class MasterPaycodeMappingRepository {
  abstract create(
    data: Omit<
      MasterPaycodeMapping,
      'id' | 'createdAt' | 'deletedAt' | 'updatedAt'
    >,
  ): Promise<MasterPaycodeMapping>;

  abstract update(
    id: MasterPaycodeMapping['id'],
    payload: Partial<MasterPaycodeMapping>,
  ): Promise<MasterPaycodeMapping>;

  abstract getCommissionGrid(
    carrierId: string,
    companyId?: string,
  ): Promise<PaycodeGridResponseDto[]>;

  abstract findOneById(
    id: MasterPaycodeMapping['id'],
  ): Promise<NullableType<MasterPaycodeMapping>>;

  abstract findOneBy(
    options: FindOptionsWhere<MasterPaycodeMappingEntity>,
  ): Promise<NullableType<MasterPaycodeMapping>>;

  abstract findOne(
    options: FindOneOptions<MasterPaycodeMappingEntity>,
  ): Promise<NullableType<MasterPaycodeMapping>>;

  abstract find(
    options: FindManyOptions<MasterPaycodeMappingEntity>,
  ): Promise<MasterPaycodeMapping[]>;

  abstract remove(masterPaycodeId: string, paycodeId: string): Promise<void>;

  abstract removeAll(
    entries: { masterPaycodeId: string; paycodeId: string }[],
  ): Promise<void>;

  abstract findByCarrierId(carrierId: string): Promise<MasterPaycodeMapping[]>;
}
