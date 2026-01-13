import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { RegionService } from './region.service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Region } from './domain/region';
import { QueryRegionDto } from './dto/query-region.dto';

@ApiTags('regions')
@Controller({
  path: 'regions',
  version: '1',
})
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all regions/states (for dropdowns)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Regions retrieved successfully',
    type: Region,
    isArray: true,
  })
  @Get()
  async findAll(@Query() query: QueryRegionDto): Promise<Region[]> {
    return this.regionService.findAll(query);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get region by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Region retrieved successfully',
    type: Region,
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: Region['id'],
  ): Promise<Region | null> {
    return this.regionService.findOne(id);
  }
}

