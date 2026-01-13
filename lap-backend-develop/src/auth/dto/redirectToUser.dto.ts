import { ApiProperty } from '@nestjs/swagger';

export class RedirectToUser {
  @ApiProperty()
  accessToken: string;
}
