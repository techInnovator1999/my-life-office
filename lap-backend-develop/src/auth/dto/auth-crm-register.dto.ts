import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '@/utils/transformers/lower-case.transformer';
import { IsEqual } from '@/utils/validators/equal.validators';
import { RegistrationTypeEnum } from '../registration-type.enum';

export class AuthCrmRegisterDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName: string;

  @ApiProperty({ example: 'agent@example.com' })
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

  @ApiProperty()
  @MinLength(4)
  @MaxLength(20)
  @IsEqual('password')
  confirm_password: string;

  @ApiProperty({ example: 'LIFE_INSURANCE' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  primaryLicenseType: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  mobile?: string | null;

  @ApiProperty({
    enum: RegistrationTypeEnum,
    example: RegistrationTypeEnum.INDIVIDUAL,
    required: false,
  })
  @IsOptional()
  @IsEnum(RegistrationTypeEnum)
  registrationType?: RegistrationTypeEnum | null;

  @ApiProperty({ example: 'CA', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  residentState?: string | null;

  @ApiProperty({ example: 'LIC123456', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  licenseNumber?: string | null;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  yearsLicensed?: number | null;

  @ApiProperty({ example: 'Life Insurance, Health Insurance', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  priorProductsSold?: string | null;

  @ApiProperty({ example: 'ABC Insurance Company', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  currentCompany?: string | null;

  @ApiProperty({ example: 'agent-uuid-here', required: false })
  @IsOptional()
  @IsString()
  sponsoringAgentId?: string | null;
}

