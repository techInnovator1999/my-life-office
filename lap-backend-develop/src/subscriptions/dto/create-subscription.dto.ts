import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ServiceMainIdsDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;
}

export class CreateSubscriptionDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  name: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  description?: string | null;

  @ApiProperty({ type: [ServiceMainIdsDto], required: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceMainIdsDto)
  services: ServiceMainIdsDto[];
}
