import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from './create-service.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSubServiceDto } from './create-sub-service.dto';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  @ApiProperty({ description: 'Name of the service main' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ description: 'Short Name of the service main' })
  @IsString()
  @IsOptional()
  shortName: string;
}

export class UpdateSubServiceDto extends PartialType(CreateSubServiceDto) {
  @ApiProperty({ description: 'Name of the sub service' })
  @IsString()
  @IsOptional()
  name: string;
}
