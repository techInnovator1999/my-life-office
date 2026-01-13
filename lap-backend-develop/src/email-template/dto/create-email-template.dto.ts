import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { EmailNameEnum } from '../email-template.enum';

export class CreateEmailTemplateDto {
  @ApiProperty({ enum: EmailNameEnum })
  @IsNotEmpty()
  name: EmailNameEnum;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  html: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  json: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  subject: string;
}
