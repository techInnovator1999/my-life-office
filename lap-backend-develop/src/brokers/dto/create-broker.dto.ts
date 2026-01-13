import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BrokerTypeEnum } from '../brokers.enum';
import { Carrier } from '@/carriers/domain/carrier';
import { BrokerStaff } from '../domain/broker_staff';
import { Type } from 'class-transformer';

export class CreateBrokerDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: [Carrier] })
  @IsArray()
  // @IsUUID('all', { each: true })
  @Type(() => Carrier)
  @IsOptional()
  carriers?: Carrier[];

  @ApiProperty({ type: [BrokerStaff] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BrokerStaff)
  @IsOptional()
  brokerStaff?: BrokerStaff[];

  @ApiProperty({ enum: BrokerTypeEnum })
  @IsEnum(BrokerTypeEnum)
  brokerType: BrokerTypeEnum;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  website: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  contracting: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNumber()
  @IsOptional()
  mainContact: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNumber()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  notes: string;
}
