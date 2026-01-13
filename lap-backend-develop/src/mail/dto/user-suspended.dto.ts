import { DefaultTagsDto } from './default-tags.dto';

export class UserSuspendedDto extends DefaultTagsDto {
  userName: string | null = 'John Doe';
  reason: string | null = 'Reason';
  startDate: string | null = '01/01/2021';
  endDate: string | null = '01/01/2021';
}
