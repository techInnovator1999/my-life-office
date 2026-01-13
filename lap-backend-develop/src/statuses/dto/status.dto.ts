import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../domain/status';
import { IsString } from 'class-validator';

export class StatusDto implements Status {
  @ApiProperty()
  @IsString()
  id: string;
}
