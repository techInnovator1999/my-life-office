import { DefaultTagsDto } from './default-tags.dto';

export class ForgotPasswordDto extends DefaultTagsDto {
  verificationCode: string | null = '123456';
  userFirstName: string | null = 'John';
}
