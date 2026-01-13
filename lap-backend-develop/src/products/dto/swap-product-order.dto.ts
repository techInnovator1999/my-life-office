import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayMinSize, ArrayMaxSize, IsUUID } from 'class-validator';

export class SwapProductOrderDto {
  @ApiProperty({
    type: [String],
    description: 'Array of two product IDs to swap orderNo',
  })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsUUID('all', { each: true })
  ids: string[];
}
