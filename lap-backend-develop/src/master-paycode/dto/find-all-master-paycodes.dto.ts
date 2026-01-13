import { ApiProperty } from '@nestjs/swagger';
import { MasterPaycodeDto } from './master-paycode.dto';

export class FindAllMasterPaycodesDto {
  @ApiProperty({ type: MasterPaycodeDto, isArray: true })
  data: MasterPaycodeDto[];

  @ApiProperty({ description: 'Total number of master paycodes' })
  total: number;
}
