import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderResponseType {
  @ApiProperty()
  clientSecret: string | null;

  @ApiProperty()
  price: number | null;
}
