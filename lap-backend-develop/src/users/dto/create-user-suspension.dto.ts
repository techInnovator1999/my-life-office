import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserSuspensionDto {
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
}
