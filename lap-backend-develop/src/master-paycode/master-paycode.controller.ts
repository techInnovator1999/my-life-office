import {
  Controller,
  Get,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MasterPaycodeService } from './master-paycode.service';
import { RolesGuard } from '@/roles/roles.guard';
import { UsersGuard } from '@/users/users.guard';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/roles/roles.decorator';
import { RoleEnum } from '@/roles/roles.enum';
import { MasterPaycode } from './domain/master-paycode';
import { FindAllMasterPaycodesDto } from './dto/find-all-master-paycodes.dto';

@ApiBearerAuth()
@ApiTags('master-paycode')
@UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
@Controller({
  path: 'master-paycode',
  version: '1',
})
export class MasterPaycodeController {
  constructor(private readonly masterPaycodeService: MasterPaycodeService) {}

  // @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  // @HttpCode(HttpStatus.CREATED)
  // @ApiOperation({ summary: 'Create a new master paycode' })
  // @ApiResponse({
  //   status: HttpStatus.CREATED,
  //   description: 'Master Paycode created successfully',
  //   type: MasterPaycode,
  // })
  // @Post()
  // async create(@Body() dto: CreateMasterPaycodeDto): Promise<MasterPaycode> {
  //   return this.masterPaycodeService.create(dto);
  // }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all master paycodes' })
  @Get()
  async findAll(): Promise<FindAllMasterPaycodesDto> {
    return this.masterPaycodeService.findAll();
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a master paycode by ID' })
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<MasterPaycode> {
    return this.masterPaycodeService.findOne(id);
  }

  // @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  // @HttpCode(HttpStatus.NO_CONTENT)
  // @ApiOperation({ summary: 'Delete a master paycode by ID' })
  // @Delete(':id')
  // async remove(@Param('id') id: string): Promise<void> {
  //   return this.masterPaycodeService.remove(id);
  // }

  // @Patch(':id')
  // @Roles([RoleEnum.ADMIN])
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Update a master paycode by ID' })
  // @ApiParam({ name: 'id', type: 'string', required: true })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Update a master paycode by ID',
  //   type: MasterPaycode,
  // })
  // async update(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() dto: UpdateMasterPaycodeDto,
  // ): Promise<MasterPaycode> {
  //   return await this.masterPaycodeService.update(id, dto);
  // }
}
