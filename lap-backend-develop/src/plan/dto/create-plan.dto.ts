import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePlanDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'lorem ipsum...' })
  @IsString()
  @IsOptional()
  description?: string | null;

  @ApiProperty({ example: 0 })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsBoolean()
  is_main: boolean;
}
