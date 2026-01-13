import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ProductSoldService } from './product-sold.service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductSold } from './domain/product-sold';
import { QueryProductSoldDto } from './dto/query-product-sold.dto';

@ApiTags('product-sold')
@Controller({
  path: 'product-sold',
  version: '1',
})
export class ProductSoldController {
  constructor(private readonly productSoldService: ProductSoldService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all products sold (for dropdowns)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Products sold retrieved successfully',
    type: ProductSold,
    isArray: true,
  })
  @Get()
  async findAll(@Query() query: QueryProductSoldDto): Promise<ProductSold[]> {
    return this.productSoldService.findAll(query);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get product sold by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product sold retrieved successfully',
    type: ProductSold,
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: ProductSold['id'],
  ): Promise<ProductSold | null> {
    return this.productSoldService.findOne(id);
  }
}

