import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  total: number;

  @ApiProperty({ type: String })
  @IsString()
  promo_code: string;
}
