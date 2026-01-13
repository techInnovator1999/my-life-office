import { ApiProperty } from '@nestjs/swagger';

export class MasterPaycode {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: Number })
  serial?: number;

  @ApiProperty({ type: Date })
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
