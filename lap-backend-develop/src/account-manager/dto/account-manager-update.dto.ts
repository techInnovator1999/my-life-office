import { IsEqual } from '@/utils/validators/equal.validators';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class AccountManagerPasswordConfigDto {
  @ApiProperty()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @MinLength(4)
  @MaxLength(20)
  @IsEqual('password')
  @IsNotEmpty()
  confirm_password: string;
}
