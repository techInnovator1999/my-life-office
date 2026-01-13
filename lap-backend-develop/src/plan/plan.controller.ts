import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  SerializeOptions,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { NullableType } from '../utils/types/nullable.type';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { Plan } from './domain/plan';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { infinityPagination } from '@/utils/infinity-pagination';
import { InfinityPaginationResultType } from '@/utils/types/infinity-pagination-result.type';
import { QueryPlanDto } from './dto/query-plan.dto';
import { Roles } from '@/roles/roles.decorator';
import { RoleEnum } from '@/roles/roles.enum';
import { PlanDataDto } from './dto/get-data-plan.dto';
import { UsersGuard } from '@/users/users.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
@ApiTags('Plans')
@Controller({
  path: 'plans',
  version: '1',
})
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ type: CreatePlanDto })
  create(@Body() createPlanDto: CreatePlanDto): Promise<Plan> {
    return this.planService.create(createPlanDto);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get()
  @Roles([RoleEnum.ADMIN, RoleEnum.CLIENT, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: PlanDataDto })
  async findAll(
    @Query() query: QueryPlanDto,
  ): Promise<InfinityPaginationResultType<Plan>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const { total, data } = await this.planService.findManyWithPagination({
      filterOptions: query?.filters,
      sortOptions: query?.sort,
      paginationOptions: {
        page,
        limit,
      },
    });

    return infinityPagination(data, total, { page, limit });
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id')
  @Roles([RoleEnum.ADMIN, RoleEnum.CLIENT, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: Plan })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: Plan['id']): Promise<NullableType<Plan>> {
    return this.planService.findOne({ id });
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id')
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: UpdatePlanDto })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: Plan['id'],
    @Body() updateProfileDto: UpdatePlanDto,
  ): Promise<Plan | null> {
    return this.planService.update(id, updateProfileDto);
  }

  @Delete(':id')
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: Plan['id']): Promise<void> {
    return this.planService.softDelete(id);
  }
}
