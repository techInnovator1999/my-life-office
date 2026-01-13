import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Query,
  Patch,
  Delete,
  Param,
  Post,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/roles/roles.decorator';
import { RoleEnum } from '@/roles/roles.enum';
import { AccountManagerPasswordConfigDto } from './dto/account-manager-update.dto';
import { InfinityPaginationResultType } from '@/utils/types/infinity-pagination-result.type';
import { infinityPagination } from '@/utils/infinity-pagination';
import { AccountManagerService } from './account-manager.service';
import { FindAllAccountManagerDto } from './dto/find-all-account-managers.dto';
import { QueryAccountManagerDto } from './dto/query-account-manager.dto';
import { AccountInfoUpdateDto } from './dto/account-info-update.dto';
import { RolesGuard } from 'src/roles/roles.guard';
import { UsersGuard } from '@/users/users.guard';

@ApiTags('Account-Manager')
@Controller({
  path: 'account-manager',
  version: '1',
})
export class AccountManagerController {
  constructor(private readonly accountManagerService: AccountManagerService) {}

  @Patch('/password-config')
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @HttpCode(HttpStatus.CREATED)
  async PasswordConfigUpdate(
    @Body() accountManagerPasswordConfigDto: AccountManagerPasswordConfigDto,
    @Query('accountManagerId') accountManagerId: string,
  ) {
    return await this.accountManagerService.updatePasswordConfig(
      accountManagerPasswordConfigDto,
      accountManagerId,
    );
  }

  @Patch('update')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @HttpCode(HttpStatus.CREATED)
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  async update(
    @Body() accountManagerUpdateDto: AccountInfoUpdateDto,
    @Query('accountManagerId') accountManagerId: string,
  ) {
    return await this.accountManagerService.updateAccountManager(
      accountManagerUpdateDto,
      accountManagerId,
    );
  }

  @Get('view-account-manager')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
  @ApiResponse({
    type: Boolean,
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.ADMIN)
  async ViewProfile(
    @Request() request,
    @Query('accountManagerId') accountManagerId: string,
  ) {
    return await this.accountManagerService.ViewAccountManager(
      request.user,
      accountManagerId,
    );
  }

  @Get('account-manager-listing')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
  @Roles([RoleEnum.ADMIN])
  @ApiResponse({ type: FindAllAccountManagerDto })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryAccountManagerDto,
  ): Promise<InfinityPaginationResultType<FindAllAccountManagerDto>> {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const { total, data } =
      await this.accountManagerService.findManyWithPagination({
        status: query?.status,
        filterOptions: query?.filters,
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

  @Delete(':id/deleteAccountManager')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
  @HttpCode(HttpStatus.OK)
  @Roles([RoleEnum.ADMIN])
  async deleteAccountManager(@Param('id') id: string): Promise<any> {
    return this.accountManagerService.softDelete(id);
  }

  @Post(':id/deactivate')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
  @HttpCode(HttpStatus.OK)
  @Roles([RoleEnum.ADMIN])
  async deactivateAccountManager(@Param('id') id: string): Promise<any> {
    try {
      await this.accountManagerService.deactivateAccountManager(id);
    } catch (error) {
      // Log the error for debugging
      console.error('Error deactivating account manager:', error);
    }
  }

  @Post(':id/abandoned')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
  @HttpCode(HttpStatus.OK)
  @Roles([RoleEnum.ADMIN])
  async abandonedAccountManager(@Param('id') id: string): Promise<any> {
    try {
      await this.accountManagerService.abandonedAccountManager(id);
    } catch (error) {
      console.error('Error abandoned account manager:', error);
    }
  }

  @Post(':id/activate')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
  @HttpCode(HttpStatus.OK)
  @Roles([RoleEnum.ADMIN])
  async activateAccountManager(@Param('id') id: string): Promise<any> {
    await this.accountManagerService.activateAccountManager(id);
  }
}
