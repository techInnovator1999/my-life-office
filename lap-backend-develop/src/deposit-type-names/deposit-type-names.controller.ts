import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { DepositTypeNamesService } from './deposit-type-names.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersGuard } from '@/users/users.guard';
import { RolesGuard } from '@/roles/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '@/roles/roles.decorator';
import { RoleEnum } from '@/roles/roles.enum';
import { DepositTypeName } from './domain/deposit-type-name';
import { CreateDepositTypeNameDto } from './dto/create-deposit-type-name.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
@ApiTags('Deposit Type Names')
@Controller({
  path: 'deposit-type-names',
  version: '1',
})
export class DepositTypeNamesController {
  constructor(
    private readonly depositTypeNamesService: DepositTypeNamesService,
  ) {}

  @Post()
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new deposit type name' })
  @ApiResponse({
    description: 'Deposit Type Name created successfully',
    type: DepositTypeName,
  })
  async create(
    @Body() body: CreateDepositTypeNameDto,
  ): Promise<DepositTypeName> {
    return this.depositTypeNamesService.create(body);
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fetch all deposit type names' })
  @Get()
  async findAll(): Promise<DepositTypeName[]> {
    return this.depositTypeNamesService.findAll();
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a deposit type name by id' })
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: DepositTypeName['id'],
  ): Promise<void> {
    return this.depositTypeNamesService.remove(id);
  }
}
