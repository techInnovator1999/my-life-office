import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '@/utils/transformers/lower-case.transformer';
import { IsEqual } from '@/utils/validators/equal.validators';
import { HeardByEnum, UserDeviceLanguageEnum } from '@/users/users.enum';

export class AuthRegisterLoginDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @ApiProperty({ type: String })
  @IsOptional()
  deviceId?: string | null;

  @ApiProperty({ example: UserDeviceLanguageEnum.en })
  @IsOptional()
  language?: UserDeviceLanguageEnum | null;

  @ApiProperty({ type: String })
  @IsOptional()
  fcmToken?: string | null;

  @ApiProperty()
  @MinLength(4)
  @MaxLength(20)
  @IsEqual('password')
  confirm_password: string;

  @ApiProperty({ example: 'John' })
  @IsOptional()
  firstName?: string | null;

  @ApiProperty({ type: String })
  @IsOptional()
  phoneNo?: string;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  lastName?: string | null;

  @ApiProperty({ example: '(Temp)' })
  @IsOptional()
  liscensed_partner?: string | null;

  @ApiProperty({ example: 'Az98' })
  @IsOptional()
  reference_code?: string | null;

  @ApiProperty({ enum: HeardByEnum, example: HeardByEnum.FACEBOOK })
  @IsEnum(HeardByEnum)
  @IsOptional()
  heardBy?: HeardByEnum;

  @ApiProperty({ example: 'Mark' })
  @IsOptional()
  referralName?: string | null;

  @ApiProperty({ example: 'Az98' })
  @IsOptional()
  defaultPromoCode?: string | null;
}
