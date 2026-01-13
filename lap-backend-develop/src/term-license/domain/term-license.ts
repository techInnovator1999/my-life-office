import { ApiProperty } from '@nestjs/swagger';

export class TermLicense {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  label: string;

  @ApiProperty({ type: String })
  value: string;

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

