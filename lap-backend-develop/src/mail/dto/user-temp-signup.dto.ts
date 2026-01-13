import { DefaultTagsDto } from './default-tags.dto';

export class UserTempSignUpDto extends DefaultTagsDto {
  hash: string = '123456';
  userName: string | null = 'John Doe';
  url: string = 'https://example.com';
}
