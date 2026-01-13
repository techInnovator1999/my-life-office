import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GetUserSuspensionDto {
  @ApiProperty({
    description: 'The unique identifier of the user suspension',
    example: 'uuid',
  })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'The user ID associated with the suspension' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'The start date of the suspension',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    description: 'The end date of the suspension',
    example: '2023-01-10T00:00:00.000Z',
    nullable: true,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate: Date | null;

  @ApiProperty({
    description: 'The reason for the suspension',
    example: 'Violation of terms',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  reason: string | null;

  @ApiProperty({
    description: 'The date when the suspension was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the suspension was last updated',
    example: '2023-01-05T00:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}
