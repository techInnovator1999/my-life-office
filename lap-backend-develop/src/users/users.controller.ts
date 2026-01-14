import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  HttpStatus,
  Request,
  HttpCode,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { InfinityPaginationResultType } from '../utils/types/infinity-pagination-result.type';
import { QueryUserDto } from './dto/query-user.dto';
import { UsersService } from './users.service';
import { FindAllUserDto } from './dto/find-all-user.dto';
import { DeactivateUserDto } from './dto/deactivate-user.dto';
import { CreateUserSuspensionDto } from './dto/create-user-suspension.dto';
import { GetUserSuspensionDto } from './dto/get-user-suspension.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersGuard } from './users.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @ApiResponse({ type: FindAllUserDto })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryUserDto,
    @Request() request,
  ): Promise<InfinityPaginationResultType<FindAllUserDto>> {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const { total, data } = await this.usersService.findManyWithPagination({
      filterOptions: query?.filters,
      userId: query?.userId,
      role: request.user.role.id,
      currentUserId: request.user.id,
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

  @Get('crm-agents')
  @Roles([RoleEnum.ADMIN])
  @ApiResponse({ type: FindAllUserDto })
  @HttpCode(HttpStatus.OK)
  async findCrmAgents(
    @Query() query: QueryUserDto,
  ): Promise<InfinityPaginationResultType<FindAllUserDto>> {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const { total, data } = await this.usersService.findCrmAgents({
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

  @Get('crm-agents/pending')
  @Roles([RoleEnum.ADMIN])
  @ApiResponse({ type: FindAllUserDto })
  @HttpCode(HttpStatus.OK)
  async findPendingCrmAgents(
    @Query() query: QueryUserDto,
  ): Promise<InfinityPaginationResultType<FindAllUserDto>> {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const { total, data } = await this.usersService.findPendingCrmAgents({
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

  @Post(':id/approve')
  @Roles([RoleEnum.ADMIN])
  @HttpCode(HttpStatus.OK)
  async approveAgent(@Param('id') id: string): Promise<any> {
    await this.usersService.update(id, {
      isApproved: true,
      approvedAt: new Date(),
    });
    return { message: 'Agent approved successfully' };
  }

  @Get('filter-chart')
  @HttpCode(HttpStatus.OK)
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER, RoleEnum.ACCOUNT_MANAGER])
  filterChartByEarning(): Promise<any> {
    return this.usersService.filterRegisteredUsersBySixMonths();
  }

  @Delete(':id/deleteUser')
  @HttpCode(HttpStatus.OK)
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  async deleteUser(@Param('id') id: string): Promise<any> {
    return this.usersService.hardDelete(id);
  }

  @Post(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  async deactivateUser(
    @Param('id') id: string,
    @Body() body: DeactivateUserDto,
    @Request() request,
  ): Promise<any> {
    if (request.user.id === id) {
      throw new BadRequestException('You cannot deactivate yourself');
    }
    await this.usersService.deactivateUser(id, body);
  }

  @Post(':id/abandoned')
  @HttpCode(HttpStatus.OK)
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  async abandonedUser(
    @Param('id') id: string,
    @Request() request,
  ): Promise<any> {
    if (request.user.id === id) {
      throw new BadRequestException('You cannot abandoned yourself');
    }
    await this.usersService.abandonedUser(id);
  }

  @Post(':id/activate')
  @HttpCode(HttpStatus.OK)
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  async activateUser(@Param('id') id: string): Promise<any> {
    await this.usersService.activateUser(id);
  }

  @Post(':id/suspend')
  @HttpCode(HttpStatus.OK)
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  async suspendUser(
    @Param('id') id: string,
    @Body() body: CreateUserSuspensionDto,
    @Request() request,
  ): Promise<any> {
    if (request.user.id === id) {
      throw new BadRequestException('You cannot suspend yourself');
    }
    await this.usersService.suspendUser(id, body);
  }

  @Post('suspension/:id/unsuspend')
  @HttpCode(HttpStatus.OK)
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  async unsuspendUser(@Param('id') id: string): Promise<any> {
    await this.usersService.unSuspend(id);
  }

  @Get(':id/suspensions')
  @HttpCode(HttpStatus.OK)
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @ApiResponse({ type: GetUserSuspensionDto, isArray: true })
  async getAllSuspensions(
    @Param('id') id: string,
  ): Promise<GetUserSuspensionDto[]> {
    return await this.usersService.getUserAllSuspensions(id);
  }

  @Get('my-suspensions')
  @HttpCode(HttpStatus.OK)
  @Roles([RoleEnum.ACCOUNT_MANAGER, RoleEnum.CLIENT])
  @ApiResponse({ type: GetUserSuspensionDto, isArray: true })
  async getMySuspensions(@Request() request): Promise<GetUserSuspensionDto[]> {
    return await this.usersService.getUserActiveSuspensions(request.user.id);
  }

  @Post(':id/update-profile')
  @HttpCode(HttpStatus.OK)
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER, RoleEnum.AGENT])
  async updateProfile(
    @Param('id') id: string,
    @Body() body: Partial<CreateUserDto>,
    @Request() request,
  ): Promise<any> {
    // Users can only update their own profile unless they're admin
    if (request.user.role.id !== RoleEnum.ADMIN && request.user.id !== id) {
      throw new BadRequestException('You can only update your own profile');
    }
    const updatedUser = await this.usersService.update(id, body);
    return updatedUser;
  }
}
