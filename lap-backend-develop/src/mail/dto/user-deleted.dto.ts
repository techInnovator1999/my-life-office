import { DefaultTagsDto } from './default-tags.dto';

export class UserDeletedDto extends DefaultTagsDto {
  userName: string | null = 'John Doe';
  date: string | null = '01/01/2021';
}
