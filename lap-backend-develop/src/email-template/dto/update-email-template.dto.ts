import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
export class UpdateEmailTemplateDto {
  @ApiProperty({ type: String })
  @IsOptional()
  html: string;

  @ApiProperty({ type: 'object', additionalProperties: true })
  @IsOptional()
  json: object;

  @ApiProperty({ type: String })
  @IsOptional()
  subject: string;
}
