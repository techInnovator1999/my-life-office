import { MasterPaycodeEntity } from '@/master-paycode/infrastructure/persistence/relational/entities/master-paycode.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MasterPaycodeSeedService {
  constructor(
    @InjectRepository(MasterPaycodeEntity)
    private readonly masterPaycodeRepo: Repository<MasterPaycodeEntity>,
  ) {}

  run(names: string[]) {
    const entities = names.map((name) =>
      this.masterPaycodeRepo.create({ name }),
    );
    return this.masterPaycodeRepo.save(entities);
  }
}
