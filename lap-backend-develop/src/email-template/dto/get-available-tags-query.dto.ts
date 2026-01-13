import { ApiProperty } from '@nestjs/swagger';
import { EmailNameEnum } from '../email-template.enum';
import { IsNotEmpty } from 'class-validator';

export class GetAvailableTagsQueryDto {
  @ApiProperty({ enum: EmailNameEnum })
  @IsNotEmpty()
  emailName: EmailNameEnum;
}
