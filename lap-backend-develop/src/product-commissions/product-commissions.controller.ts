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
import { ProductCommissionsService } from './product-commissions.service';
import { Roles } from '@/roles/roles.decorator';
import { RoleEnum } from '@/roles/roles.enum';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProductCommissionDto } from './dto/create-product-commission.dto';
import { ProductCommission } from './domain/product-commission';
import { UpdateProductCommissionDto } from './dto/update-product-commission.dto';
import { RolesGuard } from '@/roles/roles.guard';
import { UsersGuard } from '@/users/users.guard';
import { AuthGuard } from '@nestjs/passport';
import { ProductCommissionEntity } from './infrastructure/persistence/relational/entities/product-commission.entity';
import { QueryProductCommissionDto } from './dto/query-product-commission.dto';
import { InfinityPaginationResultType } from '@/utils/types/infinity-pagination-result.type';
import { infinityPagination } from '@/utils/infinity-pagination';

ApiBearerAuth();
@UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
@ApiTags('product-commissions')
@Controller({
  path: 'product-commissions',
  version: '1',
})
export class ProductCommissionsController {
  constructor(
    private readonly productCommissionsService: ProductCommissionsService,
  ) {}

  @Post()
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product commission' })
  @ApiResponse({
    description: 'Product commission created successfully',
    type: ProductCommissionEntity,
  })
  async create(
    @Body()
    data: CreateProductCommissionDto,
  ): Promise<ProductCommission> {
    return this.productCommissionsService.create(data);
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Finds a product commission by Id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product commission found successfully',
    type: ProductCommission,
  })
  @Get(':id')
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductCommission> {
    return this.productCommissionsService.findById(id);
  }

  @Patch(':id')
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a product commission' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product commission updated successfully',
    type: ProductCommission,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateProductCommissionDto,
  ): Promise<ProductCommission> {
    return this.productCommissionsService.update(id, data);
  }

  @Delete(':id')
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product commission' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productCommissionsService.delete(id);
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Finds all commission levels with pagination' })
  @Get()
  async findAllWithPagination(
    @Query() query: QueryProductCommissionDto,
  ): Promise<InfinityPaginationResultType<ProductCommissionEntity>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    query.filters ??= {};

    if (query.filters?.name) {
      query.filters.name = query.filters.name.trim();
    }

    const { total, data } =
      await this.productCommissionsService.findManyWithPagination({
        filterOptions: query?.filters,
        id: query?.id,
        // sortOptions: undefined,
        paginationOptions: {
          page,
          limit,
        },
      });

    return infinityPagination(data, total, { page, limit });
  }
}
