import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsArray,
  IsNotEmpty,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ description: 'Name of the main service' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Shortname of the main service' })
  @IsString()
  @IsOptional()
  shortName: string;

  @ApiPropertyOptional({ description: 'Description of the main service' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'List of service sub type IDs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  serviceSubTypeIds?: string[];

  @ApiPropertyOptional({
    description: 'List of deposit type IDs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  depositTypeIds?: string[];

  @ApiPropertyOptional({
    description: 'List of carrier IDs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  carrierIds?: string[];
}
