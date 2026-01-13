// create-paycode.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsUUID,
  IsString,
  ValidateNested,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { PaycodeType } from '../paycodes.enum';

class CarrierDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsUUID()
  id: string;
}

export class CreatePaycodeDto {
  @ApiProperty({ type: CarrierDto, required: true })
  @ValidateNested()
  @Type(() => CarrierDto)
  carrier: CarrierDto;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    enum: PaycodeType,
    required: false,
    default: PaycodeType.VENDOR,
  })
  @IsOptional()
  @IsEnum(PaycodeType)
  type: PaycodeType;
}
