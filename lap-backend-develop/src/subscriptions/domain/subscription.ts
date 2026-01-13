import { ApiProperty } from '@nestjs/swagger';

export class Subscription {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  description?: string | null;

  // @ApiProperty({ type: [ServiceMain] })
  // services: ServiceMain[];

  @ApiProperty({ type: Date })
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
