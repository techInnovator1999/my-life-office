import { Roles } from '@/roles/roles.decorator';
import { RoleEnum } from '@/roles/roles.enum';
import { RolesGuard } from '@/roles/roles.guard';
import { UsersGuard } from '@/users/users.guard';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './domain/company';

@ApiBearerAuth()
@ApiTags('company')
@UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
@Controller({
  path: 'company',
  version: '1',
})
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new company with master paycodes' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Company created successfully',
    type: Company,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: CreateCompanyDto): Promise<Company> {
    return this.companyService.create(payload);
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gets all companies' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Companies fetch successfully',
    type: [Company],
  })
  @Get()
  async getAll(): Promise<{ data: Company[]; total: number }> {
    return this.companyService.findAll();
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gets a company with master paycodes by Id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Companies fetch by id',
    type: Company,
  })
  @Get(':id')
  async getOne(
    @Param('id', ParseUUIDPipe) companyId: string,
  ): Promise<Company | null> {
    return this.companyService.findOne(companyId);
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Updates a comapny' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Company updated successfully',
    type: Company,
  })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCompanyDto,
  ): Promise<Company> {
    return this.companyService.update(id, dto);
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletes a comapny' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.companyService.delete(id);
  }
}
