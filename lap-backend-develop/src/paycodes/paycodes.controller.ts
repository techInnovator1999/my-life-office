import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaycodesService } from './paycodes.service';
import { RolesGuard } from '@/roles/roles.guard';
import { UsersGuard } from '@/users/users.guard';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '@/roles/roles.decorator';
import { RoleEnum } from '@/roles/roles.enum';
import { CreatePaycodeDto } from './dto/create-paycode.dto';
import { Paycode } from './domain/paycode';
import { UpdatePaycodeDto } from './dto/update-paycode.dto';

@ApiBearerAuth()
@ApiTags('Paycodes')
@UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
@Controller({
  path: 'paycodes',
  version: '1',
})
export class PaycodesController {
  constructor(private readonly paycodesService: PaycodesService) {}

  @Post()
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new paycode' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Paycode created successfully',
    type: Paycode,
  })
  async create(
    @Body()
    data: CreatePaycodeDto,
  ): Promise<Paycode> {
    return this.paycodesService.create(data);
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Finds a paycode by Id' })
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: Paycode['id'],
  ): Promise<Paycode> {
    return this.paycodesService.findOneById(id);
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Updates paycode by Id' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: Paycode['id'],
    @Body() data: UpdatePaycodeDto,
  ): Promise<Paycode> {
    return this.paycodesService.update(id, data);
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Finds all paycodes with optional carrier filter' })
  @Get()
  async findAllByCarrierId(
    @Query('carrierId') carrierId?: string,
  ): Promise<{ data: Paycode[]; total: number }> {
    const findAllResponse = carrierId
      ? await this.paycodesService.findAllByCarrierId(carrierId)
      : await this.paycodesService.findAll();
    return {
      data: findAllResponse?.data,
      total: findAllResponse?.total,
    };
  }
}
