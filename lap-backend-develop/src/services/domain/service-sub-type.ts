// domain/service-sub-type.ts
import { ApiProperty } from '@nestjs/swagger';
import { ServiceMain } from './service-main';
export class ServiceSubType {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  description?: string | null;

  serviceMain: ServiceMain;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: Date })
  deletedAt?: Date | null;
}
