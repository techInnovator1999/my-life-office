import { Product } from '@/products/domain/product';
import { ServiceMain } from '@/services/domain/service-main';
import { DepositTypeName } from '../../deposit-type-names/domain/deposit-type-name';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

export class DepositType {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: [DepositTypeName] })
  @IsArray()
  @IsString({ each: true })
  @Type(() => DepositTypeName)
  names: DepositTypeName[];

  @ApiProperty({ type: () => ServiceMain })
  serviceMain: ServiceMain;

  @ApiProperty({ type: [Product], default: [] })
  products: Product[];

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
