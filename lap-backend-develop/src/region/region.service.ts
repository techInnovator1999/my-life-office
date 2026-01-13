import { Injectable } from '@nestjs/common';
import { Region } from './domain/region';
import { RegionRepository } from './infrastructure/persistence/region.repository';
import { QueryRegionDto } from './dto/query-region.dto';

@Injectable()
export class RegionService {
  constructor(
    private readonly regionRepository: RegionRepository,
  ) {}

  async findAll(query?: QueryRegionDto): Promise<Region[]> {
    return this.regionRepository.findAll(query);
  }

  async findOne(id: string): Promise<Region | null> {
    return this.regionRepository.findOne(id);
  }
}

