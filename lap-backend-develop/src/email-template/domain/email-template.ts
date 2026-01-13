import { ApiProperty } from '@nestjs/swagger';
import { EmailNameEnum } from '../email-template.enum';

export class EmailTemplate {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  subject: string;

  @ApiProperty({ enum: EmailNameEnum })
  name: EmailNameEnum;

  @ApiProperty({ type: 'object', additionalProperties: true })
  json: object;

  @ApiProperty({ type: String })
  html: string;

  @ApiProperty({ type: Date })
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
