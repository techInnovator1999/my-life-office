import { DefaultTagsDto } from './default-tags.dto';

export class CrmAgentSignupDto extends DefaultTagsDto {
  verificationCode: string = '123456';
  userName: string | null = 'John Doe';
}

