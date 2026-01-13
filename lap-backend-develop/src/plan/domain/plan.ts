import { ApiProperty } from '@nestjs/swagger';

export class Plan {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  description?: string | null;

  @ApiProperty({ type: Number })
  price: number;

  @ApiProperty({ type: Date })
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
