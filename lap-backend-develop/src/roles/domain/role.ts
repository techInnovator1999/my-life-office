import { Allow } from 'class-validator';

export class Role {
  @Allow()
  id: string;

  @Allow()
  name?: string;
}
