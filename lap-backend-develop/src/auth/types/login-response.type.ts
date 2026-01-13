import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/domain/user';

export class LoginResponseType {
  @ApiProperty({ type: String })
  token: string;

  @ApiProperty({ type: String })
  refreshToken: string;

  @ApiProperty({ type: Number })
  tokenExpires: number;

  @ApiProperty({ type: User })
  user: User;
}
