// find-all-broker.dto.ts
import { BrokerTypeEnum } from '@/brokers/brokers.enum';
import { ApiProperty } from '@nestjs/swagger';

export class FindAllBrokerDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ enum: BrokerTypeEnum })
  brokerType: BrokerTypeEnum;

  @ApiProperty({ type: String, required: false })
  website?: string;

  @ApiProperty({ type: String, required: false })
  address?: string;

  // carriers?: CarrierBriefDto[];
  // brokerStaff?: BrokerStaffBriefDto[];
}
