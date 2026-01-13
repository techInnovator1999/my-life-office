import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class DeactivateUserDto {
  @ApiProperty({
    description: 'The reason for the suspension',
    example: 'Violation of terms',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  reason: string | null;
}
