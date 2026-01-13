import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
  Query,
  BadRequestException,
  Patch,
} from '@nestjs/common';
import { MainService } from './services.service';
import { RoleEnum } from '@/roles/roles.enum';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@/roles/roles.guard';
import { UsersGuard } from '@/users/users.guard';
import { Roles } from '@/roles/roles.decorator';
import { ServiceTypeEnum } from './services.enum';
import { ServiceMain } from './domain/service-main';
import { InfinityPaginationResultType } from '@/utils/types/infinity-pagination-result.type';
import { infinityPagination } from '@/utils/infinity-pagination';
import {
  QueryServiceMainDto,
  QueryServiceSubDto,
} from './dto/query-service.dto';
import {
  UpdateServiceDto,
  UpdateSubServiceDto,
} from './dto/update-service.dto';
import { CreateSubServiceDto } from './dto/create-sub-service.dto';
import { ServiceSubType } from './domain/service-sub-type';
import { SubService } from './subService.service';

ApiBearerAuth();
@UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
@ApiTags('Services')
@Controller({
  path: 'services',
  version: '1',
})
export class ServicesController {
  constructor(
    private readonly mainService: MainService,
    private readonly subService: SubService,
  ) {}

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.CREATED)
  @Post('create-main')
  async createMain(
    @Body()
    data: Omit<ServiceMain, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ) {
    const service = await this.mainService.create(data);
    return { data: service };
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.CREATED)
  @Post('create-sub')
  async createSub(@Body() subServiceDto: CreateSubServiceDto) {
    const subService = await this.subService.create(subServiceDto);
    return {
      data: subService,
    };
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all main services.' })
  @Get('main')
  async findAll(
    @Query() query: QueryServiceMainDto,
  ): Promise<InfinityPaginationResultType<ServiceMain>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }
    const serviceMainId = query?.id;

    const { total, data } = await this.mainService.findManyWithPagination({
      filterOptions: query?.filters,
      id: serviceMainId,
      sortOptions: query?.sort,
      paginationOptions: {
        page,
        limit,
      },
    });

    return infinityPagination(data, total, { page, limit });
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all sub services services.' })
  @Get('sub')
  async findAllSub(
    @Query() query: QueryServiceSubDto,
    @Query('mainServiceId') mainServiceId: string,
  ): Promise<InfinityPaginationResultType<ServiceSubType>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const { total, data } = await this.subService.findManyWithPagination({
      paginationOptions: {
        page,
        limit,
      },
      mainServiceId,
    });

    return infinityPagination(data, total, { page, limit });
  }

  @ApiQuery({ name: 'type', enum: ServiceTypeEnum })
  @ApiOperation({ summary: 'Get a service by ID.' })
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: string, @Query('type') type?: ServiceTypeEnum) {
    if (type === ServiceTypeEnum.SERVICE_MAIN) {
      return this.mainService.findOne(id);
    }

    if (type === ServiceTypeEnum.SERVICE_SUB_TYPE) {
      return this.subService.findOne(id);
    }
    throw new BadRequestException('Invalid service type');
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Updates a main service by ID.' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    const updateRes = await this.mainService.update(id, updateServiceDto);
    return { data: updateRes };
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Updates a sub-service by ID.' })
  @Patch(':id/sub')
  async updateSub(
    @Param('id') id: string,
    @Body() updateDto: UpdateSubServiceDto,
  ) {
    const updateRes = await this.subService.update(id, updateDto);
    return { data: updateRes };
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a service by ID.' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.mainService.delete(id);
    return {
      message: 'Service deleted successfully',
    };
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a sub-service by ID.' })
  @Delete(':id/sub')
  async removeSubService(@Param('id') id: string) {
    await this.subService.delete(id);
    return {
      message: 'Sub-service deleted successfully',
    };
  }
}
