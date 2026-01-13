import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/users/domain/user';

export class AccountManager {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
  })
  access_config?: any;

  user: User;

  @ApiProperty({ type: Date })
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
