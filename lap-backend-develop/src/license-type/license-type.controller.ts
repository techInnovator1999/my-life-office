import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { LicenseTypeService } from './license-type.service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LicenseType } from './domain/license-type';
import { QueryLicenseTypeDto } from './dto/query-license-type.dto';

@ApiTags('license-types')
@Controller({
  path: 'license-types',
  version: '1',
})
export class LicenseTypeController {
  constructor(private readonly licenseTypeService: LicenseTypeService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all license types (for dropdowns)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'License types retrieved successfully',
    type: LicenseType,
    isArray: true,
  })
  @Get()
  async findAll(@Query() query: QueryLicenseTypeDto): Promise<LicenseType[]> {
    return this.licenseTypeService.findAll(query);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get license type by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'License type retrieved successfully',
    type: LicenseType,
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: LicenseType['id'],
  ): Promise<LicenseType | null> {
    return this.licenseTypeService.findOne(id);
  }
}

