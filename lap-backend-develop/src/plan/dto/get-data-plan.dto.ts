import { ApiProperty } from '@nestjs/swagger';
import { Plan } from '../domain/plan';

export class PlanDataDto {
  @ApiProperty()
  data: Plan;

  @ApiProperty()
  hasNextPage: boolean;
}
