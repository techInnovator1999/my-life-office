import { DepositTypeNameEntity } from '@/deposit-type-names/infrastructure/persistence/relational/entities/deposit-type-name.entity';
import { DepositTypeEntity } from '@/deposit-types/infrastructure/persistence/relational/entities/deposit-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const DEPSOSIT_TYPE_NAME_FIXED = 'Fixed';
export class DepositTypeSeedService {
  constructor(
    @InjectRepository(DepositTypeNameEntity)
    private readonly dtNameRepo: Repository<DepositTypeNameEntity>,
    @InjectRepository(DepositTypeEntity)
    private readonly dtRepo: Repository<DepositTypeEntity>,
  ) {}

  async run(serviceMainId: string): Promise<DepositTypeEntity> {
    // 1. Get the fixed DepositTypeName
    let dtName = await this.dtNameRepo.findOneBy({
      name: DEPSOSIT_TYPE_NAME_FIXED,
    });

    if (!dtName) {
      console.log(
        'No fixed deposit type name found in the database. Creating now.',
      );

      dtName = await this.dtNameRepo.save(
        this.dtNameRepo.create({
          name: DEPSOSIT_TYPE_NAME_FIXED,
        }),
      );
    }

    const newDepositType = this.dtRepo.create({
      names: [{ id: dtName.id } as any],
      serviceMain: { id: serviceMainId } as any, // Minimal reference (avoid loading full ServiceMain entity)
    });

    const savedDt = await this.dtRepo.save(newDepositType);
    return savedDt;
  }
}
