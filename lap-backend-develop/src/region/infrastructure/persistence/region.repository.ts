import { Region } from '@/region/domain/region';
import { QueryRegionDto } from '@/region/dto/query-region.dto';

export abstract class RegionRepository {
  abstract findAll(query?: QueryRegionDto): Promise<Region[]>;
  abstract findOne(id: string): Promise<Region | null>;
}

