import { DefaultTagsDto } from './default-tags.dto';

export class AdminNotifyDto extends DefaultTagsDto {
  userName: string | null = 'John Doe';
  email: string | null = 'user@example.com';
  referalCode: string | null = '123456';
  referalPartnerName: string | null = 'Jane Doe';
  heardBy: string | null = 'Friend';
  referralName?: string | null = 'Mark';
  type: string | null = '- Direct';
}
