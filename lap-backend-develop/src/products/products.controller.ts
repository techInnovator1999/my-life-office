import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpStatus,
  UseGuards,
  HttpCode,
  Query,
  Delete,
  Patch,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@/roles/roles.guard';
import { UsersGuard } from '@/users/users.guard';
import { Roles } from '@/roles/roles.decorator';
import { RoleEnum } from '@/roles/roles.enum';
import { Product } from './domain/product';
import { InfinityPaginationResultType } from '@/utils/types/infinity-pagination-result.type';
import { QueryProductDto } from './dto/query-product.dto';
import { infinityPagination } from '@/utils/infinity-pagination';
import { ProductDto } from './dto/product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { SwapProductOrderDto } from './dto/swap-product-order.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NullableType } from '@/utils/types/nullable.type';

ApiBearerAuth();
@UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
@ApiTags('products')
@Controller({
  path: 'products',
  version: '1',
})
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    description: 'Product created successfully',
    type: Product,
  })
  async create(
    @Body() // data: Omit<Product, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
    data: CreateProductDto,
  ): Promise<Product> {
    return this.productsService.create(data);
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Finds a product by Id' })
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<NullableType<Product>> {
    return this.productsService.findOneById(id);
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.CLIENT, RoleEnum.ACCOUNT_MANAGER])
  @ApiOperation({ summary: 'Updates a product by Id' })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateParams: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateParams);
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Swaps order Numbers of two products' })
  @Patch('actions/swap')
  async swapProductOrders(@Body() dto: SwapProductOrderDto) {
    return this.productsService.swapProductOrders(dto);
  }

  @ApiOperation({ summary: 'Deletes a product by Id' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  async deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.hardDelete(id);
  }

  @Get()
  @Roles([RoleEnum.ADMIN, RoleEnum.CLIENT, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: ProductDto, isArray: true })
  @ApiOperation({ summary: 'Get all products' })
  async findAll(
    @Query() query: QueryProductDto,
  ): Promise<InfinityPaginationResultType<Product>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    query.filters ??= {};

    if (query.carrierId) {
      query.filters.carrierId = query.carrierId;
    }
    if (query.serviceMainId) {
      query.filters.serviceMainId = query.serviceMainId;
    }

    const { total, data } = await this.productsService.findManyWithPagination({
      filterOptions: query?.filters,
      id: query?.id,
      sortOptions: query?.sort ?? [{ orderBy: 'createdAt', order: 'ASC' }],
      paginationOptions: {
        page,
        limit,
      },
    });

    return infinityPagination(data, total, { page, limit });
  }

  @Get('total')
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  async getTotalProducts(@Query() query: any): Promise<{ count: number }> {
    const { startDate, endDate } = query;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.productsService.countTotalProducts(start, end);
  }
}
