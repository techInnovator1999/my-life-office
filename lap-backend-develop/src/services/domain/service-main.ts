// dto/create-service-main.dto.ts
import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DepositType } from '@/deposit-types/domain/deposit-type';
import { ServiceSubType } from './service-sub-type';
import { Carrier } from '@/carriers/domain/carrier';

export class ServiceMain {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  shortName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: [ServiceSubType], default: [] })
  @IsArray()
  serviceSubTypes: ServiceSubType[];

  @ApiProperty({ type: () => [DepositType], default: [] })
  @IsArray()
  depositTypes: DepositType[];

  @ApiProperty({ type: [Carrier], default: [] })
  @IsArray()
  carriers: Carrier[];

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: Date })
  deletedAt?: Date | null;
}
