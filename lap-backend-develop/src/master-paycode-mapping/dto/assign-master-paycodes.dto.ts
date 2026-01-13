import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { VendorPaycodeDto } from './vendor-paycode.dto';
import { LOAPaycodeDto } from './loa-paycode.dto';

export class AssignMasterPaycodesDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Carrier to which this commission applies',
  })
  @IsUUID()
  @IsNotEmpty()
  carrierId: string;

  @ApiProperty({
    type: VendorPaycodeDto,
    required: true,
    description: 'Assigned vendor paycodes to this master paycode',
  })
  @ValidateIf((o) => o.assignedCommissions && o.assignedCommissions.length > 0)
  @Type(() => {
    return VendorPaycodeDto;
  })
  @IsArray()
  @ValidateNested({ each: true })
  assignedCommissions: VendorPaycodeDto[];

  @ApiProperty({
    type: LOAPaycodeDto,
    required: true,
    description: 'Assigned LOA paycodes to this master paycode',
  })
  @ValidateIf((o) => o.loaCommissions && o.loaCommissions.length > 0)
  @Type(() => LOAPaycodeDto)
  @IsArray()
  @ValidateNested({ each: true })
  loaCommissions: LOAPaycodeDto[];
}
