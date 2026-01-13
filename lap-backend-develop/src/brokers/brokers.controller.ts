import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BrokersService } from './brokers.service';
import { Roles } from '@/roles/roles.decorator';
import { RoleEnum } from '@/roles/roles.enum';
import { RolesGuard } from '@/roles/roles.guard';
import { UsersGuard } from '@/users/users.guard';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateBrokerDto } from './dto/create-broker.dto';
import { Broker } from './domain/broker';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
@ApiTags('Brokers')
@Controller({
  path: 'brokers',
  version: '1',
})
export class BrokersController {
  constructor(private readonly brokersService: BrokersService) {}

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new broker' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Broker created successfully',
    type: Broker,
  })
  @Post()
  create(@Body() brokerDto: CreateBrokerDto): Promise<Broker> {
    return this.brokersService.createBroker(brokerDto);
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all brokers' })
  @ApiResponse({
    description: 'Brokers retrieved successfully',
    type: Broker,
    isArray: true,
  })
  @Get()
  findAll(): Promise<{ data: Broker[]; total: number }> {
    return this.brokersService.findAll();
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a broker by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Broker retrieved successfully',
    type: Broker,
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: Broker['id'],
  ): Promise<Broker | null> {
    return this.brokersService.findOneById(id);
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Updates a broker ID.' })
  @Patch(':id')
  updateBroker(
    @Param('id', ParseUUIDPipe) id: Broker['id'],
    @Body() updateParams: Partial<Broker>,
  ): Promise<Broker> {
    return this.brokersService.update(id, updateParams);
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletes a broker ID.' })
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: Broker['id']): Promise<void> {
    return this.brokersService.remove(id);
  }
}
