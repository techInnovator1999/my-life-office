import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { UserConfig } from './user-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  ADMIN_PASSWORD: string;

  @IsString()
  ADMIN_FIRSTNAME: string;

  @IsString()
  ADMIN_LASTNAME: string;

  @IsString()
  ADMIN_EMAIL: string;

  @IsString()
  CLIENT_PASSWORD: string;

  @IsString()
  CLIENT_FIRSTNAME: string;

  @IsString()
  CLIENT_LASTNAME: string;

  @IsString()
  CLIENT_EMAIL: string;
}

export default registerAs<UserConfig>('user', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    adminPassword: process.env.ADMIN_PASSWORD,
    adminFirstName: process.env.ADMIN_FIRSTNAME,
    adminLastName: process.env.ADMIN_LASTNAME,
    adminEmail: process.env.ADMIN_EMAIL,
    clientPassword: process.env.CLIENT_PASSWORD,
    clientFirstName: process.env.CLIENT_FIRSTNAME,
    clientLastName: process.env.CLIENT_LASTNAME,
    clientEmail: process.env.CLIENT_EMAIL,
  };
});
