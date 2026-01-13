import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { RolesGuard } from '@/roles/roles.guard';
import { UsersGuard } from '@/users/users.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '@/roles/roles.decorator';
import { RoleEnum } from '@/roles/roles.enum';
import { Subscription } from './domain/subscription';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
@ApiTags('Subscriptions')
@Controller({
  path: 'subscriptions',
  version: '1',
})
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creates a new subscription' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Subscription created successfully',
    type: Subscription,
  })
  async create(
    @Body()
    data: CreateSubscriptionDto,
  ): Promise<any> {
    const subscription = await this.subscriptionsService.create(data);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Subscription created successfully',
      data: subscription,
    };
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Finds all subscriptions.' })
  @Get()
  async findAll() {
    const findAllResponse = await this.subscriptionsService.findAll();

    return {
      statusCode: HttpStatus.OK,
      data: findAllResponse?.data,
      total: findAllResponse?.total,
      message: 'Subscriptions retrieved successfully',
    };
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Finds a subscription by Id' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const subscription = await this.subscriptionsService.findOneById(id);

    return { statusCode: HttpStatus.OK, data: subscription };
  }

  @ApiOperation({ summary: 'Updates a subscription by Id' })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  async update(
    @Param('id') id: string,
    @Body() updateParams: UpdateSubscriptionDto,
  ): Promise<any> {
    const updateRes = await this.subscriptionsService.update(id, updateParams);

    return {
      statusCode: HttpStatus.OK,
      message: 'Subscription updated successfully',
      data: updateRes,
    };
  }

  @ApiOperation({ summary: 'Deletes a subscription by Id' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  async deleteProduct(@Param('id') id: string): Promise<any> {
    await this.subscriptionsService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Subscription deleted successfully',
    };
  }
}
