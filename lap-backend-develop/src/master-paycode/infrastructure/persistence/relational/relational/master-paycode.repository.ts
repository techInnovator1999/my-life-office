import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MasterPaycodeRepository } from '../../master-paycode.repository';
import { MasterPaycodeEntity } from '../entities/master-paycode.entity';
import { MasterPaycode } from '@/master-paycode/domain/master-paycode';
import { MasterPaycodeMapper } from '../mappers/master-paycode.mapper';
import { FindAllMasterPaycodesDto } from '@/master-paycode/dto/find-all-master-paycodes.dto';
import { UpdateMasterPaycodeDto } from '@/master-paycode/dto/update-master-paycode.dto';

@Injectable()
export class MasterPaycodeRepositoryRelationalRepository
  implements MasterPaycodeRepository
{
  constructor(
    @InjectRepository(MasterPaycodeEntity)
    private readonly masterPaycodeRepo: Repository<MasterPaycodeEntity>,
  ) {}

  async create(payload: MasterPaycode): Promise<MasterPaycode> {
    const persistenceModel = MasterPaycodeMapper.toPersistence(payload);
    const entity = this.masterPaycodeRepo.create(persistenceModel);
    const savedEntity = await this.masterPaycodeRepo.save(entity);
    return savedEntity;
  }

  async findAll(): Promise<FindAllMasterPaycodesDto> {
    const [entities, total] = await this.masterPaycodeRepo.findAndCount({
      order: { serial: 'ASC' },
    });
    return { data: entities, total };
  }

  /**
   * Retrieves all master paycodes grouped by company
   *
   * @return {
   *   data: {
   *     companyName: string;
   *     masterPaycodes: { name: string; percentage: number; serial: number }[];
   *   }[];
   *   total: number;
   * }
   */
  // async findAllGroupedByCompany(): Promise<{
  //   data: {
  //     companyName: string;
  //     masterPaycodes: { name: string; percentage: number; serial: number }[];
  //   }[];
  //   total: number;
  // }> {
  //   const qb = this.masterPaycodeRepo
  //     .createQueryBuilder('ml')
  //     .select('c.name', 'companyName')
  //     .addSelect('c.id', 'companyId')
  //     .addSelect(
  //       `json_agg(
  //         json_build_object(
  //           'id', ml.id,
  //           'name', ml.name,
  //           'percentage', ml.percentage,
  //           'serial', ml.serial
  //         ) ORDER BY ml.serial)`,
  //       'masterPaycodes',
  //     )
  //     .innerJoin('ml.company', 'c')
  //     .groupBy('c.id, c.name')
  //     .orderBy('c.name');
  //   const data = await qb.getRawMany();
  //   const total = await this.masterPaycodeRepo
  //     .createQueryBuilder('ml')
  //     .innerJoin('ml.company', 'c')
  //     .select('COUNT(DISTINCT c.name)', 'count')
  //     .getRawOne();
  //   return {
  //     data,
  //     total: parseInt(total.count, 10),
  //   };
  // }

  async findOne(id: MasterPaycode['id']): Promise<MasterPaycode> {
    const result = await this.masterPaycodeRepo.findOne({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException(`Master Level with id ${id} not found`);
    }
    return MasterPaycodeMapper.toDomain(result);
  }

  async remove(id: MasterPaycode['id']): Promise<void> {
    const entity = await this.masterPaycodeRepo.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException('Master Level not found');
    }
    await this.masterPaycodeRepo.remove(entity);
  }

  async update(
    id: string,
    params: UpdateMasterPaycodeDto,
  ): Promise<MasterPaycode> {
    const entity = await this.masterPaycodeRepo.findOne({
      where: { id },
    });
    if (!entity) {
      throw new NotFoundException(`Master Level with id ${id} not found`);
    }

    const updatedData = MasterPaycodeMapper.toPersistence({
      ...MasterPaycodeMapper.toDomain(entity),
      ...params,
    });
    Object.assign(entity, updatedData);
    const savedEntity = await this.masterPaycodeRepo.save(entity);
    return MasterPaycodeMapper.toDomain(savedEntity);
  }
}
