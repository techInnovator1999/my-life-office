import { ApiProperty } from '@nestjs/swagger';

export class MasterPaycodeDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  serial: number;
}
