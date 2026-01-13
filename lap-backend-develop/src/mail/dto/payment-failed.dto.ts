import { DefaultTagsDto } from './default-tags.dto';

export class PaymentFailedDto extends DefaultTagsDto {
  clientDetailId: string = '123';
  userName: string | null = 'John Doe';
  planName: string | null = 'Plan Name';
  promoCode: string | null = '123456';
  orderDate: string | null = '2021-07-01';
  totalAmount: string | null = '100';
  partnerName: string | null = 'Partner Name';
  referalCode: string | null = '123 456';
  orderId: string | null = '123';
  deliveryOption: string | null = 'Delivery Option';
  orderNo: string | null = '123';
  planPrice: string | null = '100';
}
