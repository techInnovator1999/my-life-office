import { PartialType } from '@nestjs/swagger';
import { CreateProductCommissionDto } from './create-product-commission.dto';

export class UpdateProductCommissionDto extends PartialType(
  CreateProductCommissionDto,
) {}
