import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  Headers,
  Req,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { StripeService } from './stripe.service';
import { Roles } from '@/roles/roles.decorator';
import { RoleEnum } from '@/roles/roles.enum';
import { StripePaymentDto } from './dto/stripe-payment.dto';
import { CreateOrderResponseType } from './dto/stripe-order-response.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { NullableType } from '@/utils/types/nullable.type';
import { QueryStripeChargeDto } from './dto/query-stripe.dto';
import { InfinityPaginationResultType } from '@/utils/types/infinity-pagination-result.type';
import { infinityPagination } from '@/utils/infinity-pagination';
import { UsersGuard } from '@/users/users.guard';

@ApiTags('Stripe')
@ApiBearerAuth()
@Controller({
  path: 'stripe',
  version: '1',
})
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Get('charges')
  @ApiResponse({
    type: StripePaymentDto,
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  async retrievePayment(
    @Query() query: QueryStripeChargeDto,
  ): Promise<InfinityPaginationResultType<StripePaymentDto>> {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    // if (limit > 50) {
    //   limit = 50;
    // }
    const { total, data } = await this.stripeService.findManyWithPagination({
      sortOptions: query?.sort
        ? query.sort
        : [{ orderBy: 'createdAt', order: 'DESC' }],
      paginationOptions: {
        page,
        limit,
      },
    });

    return infinityPagination(data, total, { page, limit });
  }

  @Post('connect-event')
  @ApiResponse({ type: CreateOrderResponseType })
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Request() request,
  ): Promise<NullableType<CreateOrderResponseType>> {
    return await this.stripeService.create(
      createOrderDto.total,
      createOrderDto.promo_code,
      request.user.id,
    );
  }

  // @UseGuards(StripeSignatureGuard)
  @Post('webhook/account-event')
  @HttpCode(HttpStatus.OK)
  public async accountEventWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: any,
  ): Promise<void> {
    await this.stripeService.handleMyAccountEventWebhook(
      request.rawBody,
      signature,
    );
  }

  @Get('getPaymentStats')
  @ApiResponse({
    type: StripePaymentDto,
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  async getPaymentStats() {
    return await this.stripeService.getPaymentStats();
  }

  @Get('getLastMonthPayments')
  @ApiResponse({
    type: StripePaymentDto,
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  async getLastMonthPayments() {
    return await this.stripeService.getLastMonthPayments();
  }
}
