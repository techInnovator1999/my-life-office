import { DefaultTagsDto } from './default-tags.dto';

export class AdminApprovalDto extends DefaultTagsDto {
  userName: string | null = 'John Doe';
  email: string | null = 'user@example.com';
  referalCode: string | null = '123456';
}
