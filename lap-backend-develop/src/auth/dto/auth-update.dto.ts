import { HeardByEnum } from '@/users/users.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, MinLength } from 'class-validator';
import { FileDto } from 'src/files/dto/file.dto';

export class AuthUpdateDto {
  @ApiProperty({ type: () => FileDto })
  @IsOptional()
  photo?: FileDto;

  @ApiProperty({ example: 'John' })
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'true' })
  @IsOptional()
  isShowToolTip?: boolean;

  @ApiProperty()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiProperty()
  @IsOptional()
  phoneNo?: string;

  @ApiProperty()
  @IsOptional()
  oldPassword?: string;

  @ApiProperty({ example: HeardByEnum.FACEBOOK })
  @IsEnum(HeardByEnum)
  @IsOptional()
  heardBy?: HeardByEnum;

  @ApiProperty()
  @IsOptional()
  isSessionDelete?: boolean;
}
