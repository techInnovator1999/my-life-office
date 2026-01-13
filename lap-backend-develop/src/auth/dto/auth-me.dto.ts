import { User } from '@/users/domain/user';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetMeAuthDto extends User {
  @ApiProperty({ type: Boolean })
  @IsOptional()
  isZohoCodeExist?: boolean | null;
}
