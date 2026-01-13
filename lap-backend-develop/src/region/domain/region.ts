import { ApiProperty } from '@nestjs/swagger';

export class Region {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  label: string;

  @ApiProperty({ type: String })
  value: string;

  @ApiProperty({ type: String, nullable: true })
  code?: string | null;

  @ApiProperty({ type: Number })
  order: number;

  @ApiProperty({ type: Boolean })
  isActive: boolean;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: Date, nullable: true })
  deletedAt?: Date | null;
}

