import { FindAllMasterPaycodesDto } from '@/master-paycode/dto/find-all-master-paycodes.dto';
import { MasterPaycode } from '../../domain/master-paycode';
import { UpdateMasterPaycodeDto } from '../../dto/update-master-paycode.dto';

export abstract class MasterPaycodeRepository {
  abstract create(
    payload: Omit<
      MasterPaycode,
      'id' | 'createdAt' | 'deletedAt' | 'updatedAt'
    >,
  ): Promise<MasterPaycode>;

  abstract findAll(): Promise<FindAllMasterPaycodesDto>;

  abstract findOne(id: string): Promise<MasterPaycode>;

  abstract update(
    id: string,
    params: UpdateMasterPaycodeDto,
  ): Promise<MasterPaycode>;

  abstract remove(id: string): Promise<void>;
}
