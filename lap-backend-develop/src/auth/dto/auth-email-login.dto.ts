import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { UserDeviceLanguageEnum } from '@/users/users.enum';

export class AuthEmailLoginDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String })
  @IsOptional()
  password?: string | null;

  @ApiProperty({ type: String })
  @IsOptional()
  deviceId?: string | null;

  @ApiProperty({ example: UserDeviceLanguageEnum.en })
  @IsOptional()
  language?: UserDeviceLanguageEnum | null;

  @ApiProperty({ type: String })
  @IsOptional()
  fcmToken?: string | null;
}
