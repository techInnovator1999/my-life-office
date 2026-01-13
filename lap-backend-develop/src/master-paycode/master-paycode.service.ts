import { Injectable } from '@nestjs/common';
import { MasterPaycodeRepository } from './infrastructure/persistence/master-paycode.repository';
import { MasterPaycode } from './domain/master-paycode';
import { FindAllMasterPaycodesDto } from './dto/find-all-master-paycodes.dto';
import { CreateMasterPaycodeDto } from './dto/create-master-paycode.dto';
import { UpdateMasterPaycodeDto } from './dto/update-master-paycode.dto';

@Injectable()
export class MasterPaycodeService {
  constructor(private readonly repository: MasterPaycodeRepository) {}

  create(dto: CreateMasterPaycodeDto): Promise<MasterPaycode> {
    return this.repository.create(dto);
  }

  findAll(): Promise<FindAllMasterPaycodesDto> {
    return this.repository.findAll();
  }

  async findOne(id: MasterPaycode['id']): Promise<MasterPaycode> {
    return this.repository.findOne(id);
  }

  update(id: string, dto: UpdateMasterPaycodeDto): Promise<MasterPaycode> {
    return this.repository.update(id, dto);
  }

  async remove(id: MasterPaycode['id']): Promise<void> {
    return this.repository.remove(id);
  }
}
