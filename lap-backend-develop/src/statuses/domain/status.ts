import { Allow } from 'class-validator';

export class Status {
  @Allow()
  id: string;

  @Allow()
  name?: string;
}
