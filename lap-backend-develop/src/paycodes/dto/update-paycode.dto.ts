import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaycodeType } from '../paycodes.enum';

export class UpdatePaycodeDto {
  @IsString()
  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({ type: String, required: false })
  carrierId?: string;

  @IsString()
  @ApiPropertyOptional({ type: String, required: false })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ enum: PaycodeType, required: false })
  @IsOptional()
  @IsEnum(PaycodeType)
  type?: PaycodeType;
}
