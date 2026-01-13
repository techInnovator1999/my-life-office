import { registerAs } from '@nestjs/config';
import { IsString, ValidateIf } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { NotificationConfig } from './notification-config.type';

class EnvironmentVariablesValidator {
  @ValidateIf((envValues) => envValues.FCM_SERVER_KEY)
  @IsString()
  FCM_SERVER_KEY: string;

  @ValidateIf((envValues) => envValues.NOTIFICATION_LOGO)
  @IsString()
  NOTIFICATION_LOGO: string;
}

export default registerAs<NotificationConfig>('notification', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    fcmServerKey: process.env.FCM_SERVER_KEY ?? '',
    notificationLogo: process.env.NOTIFICATION_LOGO ?? '',
  };
});
