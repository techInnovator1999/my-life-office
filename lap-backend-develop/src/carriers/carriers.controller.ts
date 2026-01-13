import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CarriersService } from './carriers.service';
import { Carrier } from './domain/carrier';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@/roles/roles.guard';
import { UsersGuard } from '@/users/users.guard';
import { Roles } from '@/roles/roles.decorator';
import { RoleEnum } from '@/roles/roles.enum';
import { InfinityPaginationResultType } from '@/utils/types/infinity-pagination-result.type';
import { QueryCarrierDto } from './dto/query-carrier.dto';
import { infinityPagination } from '@/utils/infinity-pagination';
import { FindAllCarrierDto } from './dto/find-all-carrier.dto';
import { CreateCarrierDto } from './dto/create-carrier.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
@ApiTags('carriers')
@Controller({
  path: 'carriers',
  version: '1',
})
export class CarriersController {
  constructor(private readonly carriersService: CarriersService) {}

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @ApiOperation({ summary: 'Create a new carrier.' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateCarrierDto): Promise<Carrier> {
    return this.carriersService.create(data);
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @ApiOperation({ summary: 'Gets many carriers with pagination.' })
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Query() query: QueryCarrierDto,
  ): Promise<InfinityPaginationResultType<FindAllCarrierDto>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 100) {
      limit = 100;
    }

    query.filters ??= {};

    if (query.serviceMainId) {
      query.filters.serviceMainId = query.serviceMainId;
    }
    if (query.productId) {
      query.filters.productId = query.productId;
    }

    const { total, data } = await this.carriersService.findManyWithPagination({
      filterOptions: query?.filters,
      sortOptions: query?.sort,
      paginationOptions: {
        page,
        limit,
      },
    });

    return infinityPagination(data, total, { page, limit });
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @ApiOperation({ summary: 'Finds a carrier by id.' })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: Carrier['id'],
  ): Promise<Carrier | null> {
    return this.carriersService.findOneById(id);
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @ApiOperation({ summary: 'Updates a carrier' })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: Carrier['id'],
    @Body() payload: Partial<Carrier>,
  ): Promise<Carrier | null> {
    return this.carriersService.update(id, payload);
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @ApiOperation({ summary: 'Deletes a carrier' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: Carrier['id']): Promise<void> {
    return this.carriersService.hardDelete(id);
  }
}
