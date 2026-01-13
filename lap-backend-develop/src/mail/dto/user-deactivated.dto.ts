import { DefaultTagsDto } from './default-tags.dto';

export class UserDeactivatedDto extends DefaultTagsDto {
  userName: string | null = 'John Doe';
  reason: string | null = 'Reason';
  date: string | null = '01/01/2021';
}
