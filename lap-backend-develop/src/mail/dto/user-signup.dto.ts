import { DefaultTagsDto } from './default-tags.dto';

export class UserSignupDto extends DefaultTagsDto {
  verificationCode: string = '123456';
  userName: string | null = 'John Doe';
}
