import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Length } from 'class-validator';

export class AuthConfirmEmailDto {
  // @ApiProperty()
  // @IsNotEmpty()
  // hash: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6)
  code: string;

  @ApiProperty({ example: 'test@example.com' })
  @IsEmail()
  email: string;
}
