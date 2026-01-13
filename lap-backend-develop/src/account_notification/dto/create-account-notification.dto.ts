import {
  IsEnum,
  IsNotEmpty,
  IsBoolean,
  IsString,
  IsOptional,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { PushNotificationType } from '@/notification/push.notification.enum';

export class CreateAccountNotificationDto {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isRead: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  titleKey: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bodyKey: string;

  @ApiProperty({ example: PushNotificationType.NewUserRegistered })
  @IsEnum(PushNotificationType)
  @IsNotEmpty()
  type: PushNotificationType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  data: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  entityId?: string | null;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  placeHolderData: string;

  @ApiProperty({ example: 'cb8f6c5a-1b89-44fc-bffc-e1b04c9397a8' })
  @IsNotEmpty()
  user: string;
}
