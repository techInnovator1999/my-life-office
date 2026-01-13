import {
  Controller,
  Get,
  UseGuards,
  HttpStatus,
  HttpCode,
  Post,
  Body,
  Request,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { RoleEnum } from '@/roles/roles.enum';
import { Roles } from '@/roles/roles.decorator';
import { AccountNotificationService } from './account-notification.service';
import { CreateAccountNotificationDto } from './dto/create-account-notification.dto';
import { infinityPagination } from '@/utils/infinity-pagination';
import { InfinityPaginationResultType } from '@/utils/types/infinity-pagination-result.type';
import { GetAccountNotificationDto } from './dto/get-account-notification.dto';
import { QueryAccountNotificationDto } from './dto/query-account-notification.dto';
import { UsersGuard } from '@/users/users.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
@ApiTags('Account Notification')
@Controller({
  path: 'account-notification',
  version: '1',
})
export class AccountNotificationController {
  constructor(
    private readonly accountNotificationService: AccountNotificationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles([RoleEnum.ADMIN, RoleEnum.CLIENT, RoleEnum.ACCOUNT_MANAGER])
  @ApiResponse({ type: CreateAccountNotificationDto })
  create(
    @Body() createAccountNotification: CreateAccountNotificationDto,
  ): Promise<boolean> {
    return this.accountNotificationService.create(createAccountNotification);
  }

  @Get()
  @ApiResponse({ type: GetAccountNotificationDto })
  @Roles([RoleEnum.ADMIN, RoleEnum.CLIENT, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Request() request,
    @Query() query: QueryAccountNotificationDto,
  ): Promise<InfinityPaginationResultType<GetAccountNotificationDto>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }
    const filterOptions: any = {
      sortOptions: query?.sort
        ? query.sort
        : [{ orderBy: 'createdAt', order: 'DESC' }],
      paginationOptions: {
        page,
        limit,
      },
      userJwtPayload: request.user,
    };

    const { total, data } =
      await this.accountNotificationService.findManyWithPagination(
        filterOptions,
      );

    return infinityPagination(data, total, { page, limit });
  }
  // @Patch()
  // @HttpCode(HttpStatus.OK)
  // @Roles([RoleEnum.ADMIN, RoleEnum.CLIENT, RoleEnum.DEMOCLIENT])
  // @ApiResponse({ type: AccountNotification })
  // public update(
  //   @Request() request,
  //   @Body() userDto: AuthUpdateDto,
  // ): Promise<NullableType<User>> {
  //   return this.service.update(request.user, userDto);
  // }
}
