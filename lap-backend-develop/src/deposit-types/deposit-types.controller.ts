import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DepositTypesService } from './deposit-types.service';
import { Roles } from '@/roles/roles.decorator';
import { RoleEnum } from '@/roles/roles.enum';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DepositType } from './domain/deposit-type';
import { QueryDepositTypeDto } from './dto/query-deposit-type.dto';
import { infinityPagination } from '@/utils/infinity-pagination';
import { RolesGuard } from '@/roles/roles.guard';
import { UsersGuard } from '@/users/users.guard';
import { AuthGuard } from '@nestjs/passport';
import { InfinityPaginationResultType } from '@/utils/types/infinity-pagination-result.type';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
@ApiTags('deposit-types')
@Controller({
  path: 'deposit-types',
  version: '1',
})
export class DepositTypesController {
  constructor(private readonly depositTypesService: DepositTypesService) {}

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new Deposit Type' })
  @ApiResponse({
    description: 'Deposit type created successfully',
    type: DepositType,
  })
  @Post()
  async create(
    @Body()
    depositDto: Omit<
      DepositType,
      'id' | 'createdAt' | 'deletedAt' | 'updatedAt'
    >,
  ): Promise<DepositType> {
    return this.depositTypesService.create(depositDto);
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all deposit types' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deposit Types retrieved successfully',
    type: DepositType,
    isArray: true,
  })
  @Get()
  async findAll(
    @Query() query: QueryDepositTypeDto,
  ): Promise<InfinityPaginationResultType<DepositType>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const { total, data } =
      await this.depositTypesService.findManyWithPagination({
        filterOptions: query.filters,
        paginationOptions: {
          page,
          limit,
        },
      });

    return infinityPagination(data, total, { page, limit });
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get deposit type by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deposit Type retrieved successfully',
    type: DepositType,
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: DepositType['id'],
  ): Promise<DepositType> {
    return this.depositTypesService.findOne(id);
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete deposit type by id' })
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: DepositType['id']) {
    return this.depositTypesService.remove(id);
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Updates deposit type by id' })
  @ApiResponse({
    description: 'Deposit Type updated successfully',
    type: DepositType,
  })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: DepositType['id'],
    @Body()
    depositDto: Partial<DepositType>,
  ): Promise<DepositType> {
    return this.depositTypesService.update(id, depositDto);
  }
}
