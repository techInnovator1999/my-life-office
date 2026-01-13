// assigned-paycode.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class VendorPaycodeDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Master Level ID for which this commission applies',
  })
  @IsUUID()
  @IsNotEmpty()
  masterPaycodeId: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Paycode ID associated with this commission',
  })
  @IsUUID()
  @IsNotEmpty()
  paycodeId: string;
}
