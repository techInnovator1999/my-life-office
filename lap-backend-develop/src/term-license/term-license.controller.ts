import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { TermLicenseService } from './term-license.service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TermLicense } from './domain/term-license';
import { QueryTermLicenseDto } from './dto/query-term-license.dto';

@ApiTags('term-licenses')
@Controller({
  path: 'term-licenses',
  version: '1',
})
export class TermLicenseController {
  constructor(private readonly termLicenseService: TermLicenseService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all term licenses (for dropdowns)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Term licenses retrieved successfully',
    type: TermLicense,
    isArray: true,
  })
  @Get()
  async findAll(@Query() query: QueryTermLicenseDto): Promise<TermLicense[]> {
    return this.termLicenseService.findAll(query);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get term license by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Term license retrieved successfully',
    type: TermLicense,
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: TermLicense['id'],
  ): Promise<TermLicense | null> {
    return this.termLicenseService.findOne(id);
  }
}

