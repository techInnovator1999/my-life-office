import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { UserDeviceLanguageEnum } from '../users.enum';

export class CreateUserDeviceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fcmToken: string;

  @ApiProperty({ example: UserDeviceLanguageEnum.en })
  @IsEnum(UserDeviceLanguageEnum)
  @IsNotEmpty()
  language: UserDeviceLanguageEnum;

  @ApiProperty({ example: 'cb8f6c5a-1b89-44fc-bffc-e1b04c9397a8' })
  @IsNotEmpty()
  user: string;
}
