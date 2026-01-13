import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { AccountManager } from '../domain/account-manager';
import { User } from '@/users/domain/user';

export class AccountInfoUpdateDto {
  @ApiProperty()
  @IsOptional()
  user: User;

  @ApiProperty()
  @IsOptional()
  accountManager: AccountManager;
}
