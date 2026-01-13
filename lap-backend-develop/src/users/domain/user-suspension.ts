import { ApiProperty } from '@nestjs/swagger';
import { User } from './user';

export class UserSuspension {
  @ApiProperty({
    description: 'The unique identifier of the user suspension',
    example: 'uuid',
  })
  id: string;

  @ApiProperty({ description: 'The user associated with the suspension' })
  user: User;

  @ApiProperty({
    description: 'The start date of the suspension',
    example: '2023-01-01T00:00:00.000Z',
  })
  startDate: Date;

  @ApiProperty({
    description: 'The end date of the suspension',
    example: '2023-01-10T00:00:00.000Z',
    nullable: true,
  })
  endDate: Date | null;

  @ApiProperty({
    description: 'The reason for the suspension',
    example: 'Violation of terms',
    nullable: true,
  })
  reason: string | null;

  @ApiProperty({
    description: 'The date when the suspension was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the suspension was last updated',
    example: '2023-01-05T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The date when the suspension was deleted',
    example: '2023-01-10T00:00:00.000Z',
    nullable: true,
  })
  deletedAt: Date;
}
