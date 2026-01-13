// assigned-paycode.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { LOAProductCommissionDto } from './loa-product-commission.dto';
import { Type } from 'class-transformer';

export class LOAPaycodeDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Master Level ID for which this commission applies',
  })
  @IsUUID()
  @IsNotEmpty()
  masterPaycodeId: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Paycode Name to add',
  })
  @IsString()
  @IsNotEmpty()
  paycodeName: string;

  @ApiProperty({
    type: [LOAProductCommissionDto],
    required: true,
    description: 'List of loa paycodes',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => LOAProductCommissionDto)
  productCommissions: LOAProductCommissionDto[];
}
