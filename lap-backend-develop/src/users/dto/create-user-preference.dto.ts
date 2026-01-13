import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserPreferenceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  isPushNotificationEnabled: boolean;

  @ApiProperty({ example: 'cb8f6c5a-1b89-44fc-bffc-e1b04c9397a8' })
  @IsNotEmpty()
  user: string;
}
