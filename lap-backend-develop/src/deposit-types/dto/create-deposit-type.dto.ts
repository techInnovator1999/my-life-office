import { ServiceMain } from '@/services/domain/service-main';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

export class DepositType {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  names: string[];

  @ApiProperty({ type: ServiceMain, nullable: false })
  serviceMain: ServiceMain;
}
