import { DefaultTagsDto } from './default-tags.dto';

export class UserUnsuspendedDto extends DefaultTagsDto {
  userName: string | null = 'John Doe';
  reason: string | null = 'Reason';
  endDate: string | null = '01/01/2021';
}
