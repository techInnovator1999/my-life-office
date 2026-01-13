import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductCommissionsGridService } from './product-commissions-grid.service';
import { RolesGuard } from '@/roles/roles.guard';
import { UsersGuard } from '@/users/users.guard';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '@/roles/roles.decorator';
import { RoleEnum } from '@/roles/roles.enum';
import { ProductCommissionResponseDto } from './dto/product-commission-grid-response.dto';
import { InfinityPaginationResultType } from '@/utils/types/infinity-pagination-result.type';
import { infinityPagination } from '@/utils/infinity-pagination';

ApiBearerAuth();

@UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
@ApiTags('product-commissions-grid')
@Controller({
  path: 'product-commissions-grid',
  version: '1',
})
export class ProductCommissionsGridController {
  constructor(
    private readonly productCommissionsGridService: ProductCommissionsGridService,
  ) {}

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get product commissions grid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product commission grid retrieved successfully',
  })
  @Get()
  async getCommissionsByCarrierId(
    @Query('carrierId', ParseUUIDPipe) carrierId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<InfinityPaginationResultType<ProductCommissionResponseDto>> {
    const { data, total } =
      await this.productCommissionsGridService.getCommissionsByCarrierId(
        carrierId,
        page,
        limit,
      );
    return infinityPagination(data, total, { page, limit });
  }
}
