import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { RoleDto } from 'src/roles/dto/role.dto';
import { StatusDto } from 'src/statuses/dto/status.dto';
import { FileDto } from 'src/files/dto/file.dto';
import { RegistrationTypeEnum } from '@/auth/registration-type.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email: string | null;

  @ApiProperty()
  @MinLength(6)
  password?: string;

  provider?: string;

  socialId?: string | null;

  @ApiProperty({ example: 'John' })
  @IsOptional()
  firstName?: string | null;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  lastName?: string | null;

  @ApiProperty({ example: 'Az98' })
  @IsOptional()
  reference_code?: string | null;

  @ApiProperty({ type: () => FileDto })
  @IsOptional()
  photo?: FileDto | null;

  @ApiProperty({ type: RoleDto })
  @IsOptional()
  @Type(() => RoleDto)
  role?: RoleDto | null;

  @ApiProperty({ type: StatusDto })
  @IsOptional()
  @Type(() => StatusDto)
  status?: StatusDto;

  isApproved: boolean = false;

  hash?: string | null;

  verificationCode?: string | null;

  verificationExpires?: Date | null;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  referralName?: string | null;

  // CRM-specific fields
  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  mobile?: string | null;

  @ApiProperty({
    enum: RegistrationTypeEnum,
    example: RegistrationTypeEnum.INDIVIDUAL,
    required: false,
  })
  @IsOptional()
  registrationType?: RegistrationTypeEnum | null;

  @ApiProperty({ example: 'LIFE_INSURANCE', required: false })
  @IsOptional()
  primaryLicenseType?: string | null;

  @ApiProperty({ example: 'CA', required: false })
  @IsOptional()
  residentState?: string | null;

  @ApiProperty({ example: 'LIC123456', required: false })
  @IsOptional()
  licenseNumber?: string | null;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  yearsLicensed?: number | null;

  @ApiProperty({ example: 'Life Insurance, Health Insurance', required: false })
  @IsOptional()
  priorProductsSold?: string | null;

  @ApiProperty({ example: 'ABC Insurance Company', required: false })
  @IsOptional()
  currentCompany?: string | null;

  @ApiProperty({ example: 'agent-uuid-here', required: false })
  @IsOptional()
  sponsoringAgentId?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  googleAccessToken?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  googleRefreshToken?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  googleTokenExpiry?: Date | null;

  @ApiProperty({ required: false })
  @IsOptional()
  lastGoogleSyncAt?: Date | null;
}
