import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { Role } from '../domain/role';

export class RoleDto implements Role {
  @ApiProperty()
  @IsUUID()
  id: string;
}
