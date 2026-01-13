import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MasterPaycodeMappingService } from './master-paycode-mapping.service';
import { MasterPaycodeMapping } from './domain/master-paycode-mapping';
import { Roles } from '@/roles/roles.decorator';
import { RoleEnum } from '@/roles/roles.enum';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AssignMasterPaycodesDto } from './dto/assign-master-paycodes.dto';
import { RolesGuard } from '@/roles/roles.guard';
import { UsersGuard } from '@/users/users.guard';
import { AuthGuard } from '@nestjs/passport';
import { UpdateMasterPaycodeMappingDto } from './dto/update-master-paycode-mapping.dto';
import { PaycodeGridResponseDto } from './dto/paycode-grid-response.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
@ApiTags('MasterPaycodeMappings')
@Controller({
  path: 'master-paycode-mappings',
  version: '1',
})
export class MasterPaycodeMappingController {
  constructor(
    private readonly MasterPaycodeMappingService: MasterPaycodeMappingService,
  ) {}

  @Post()
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creates a new agency commission' })
  @ApiResponse({
    description: 'Creates a new agency commission',
    type: MasterPaycodeMapping,
  })
  create(
    @Body()
    data: AssignMasterPaycodesDto,
  ): Promise<MasterPaycodeMapping[]> {
    return this.MasterPaycodeMappingService.create(data);
  }

  @Put()
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Updates a paycode commission' })
  @ApiResponse({
    description: 'Updates a paycode commission',
    type: MasterPaycodeMapping,
  })
  update(
    @Body()
    data: UpdateMasterPaycodeMappingDto,
  ): Promise<MasterPaycodeMapping[]> {
    return this.MasterPaycodeMappingService.update(data);
  }

  @Get(':carrierId/grid')
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gets paycode mapping by carrier' })
  @ApiResponse({
    description: 'Gets paycode mapping by carrier',
    type: MasterPaycodeMapping,
  })
  getAgencyCommissionGrid(
    @Param('carrierId', ParseUUIDPipe)
    carrierId: string,
    @Query(
      'companyId',
      new DefaultValuePipe(undefined),
      new ParseUUIDPipe({ optional: true }),
    )
    companyId?: string,
  ): Promise<PaycodeGridResponseDto[]> {
    return this.MasterPaycodeMappingService.getCommissionGrid(
      carrierId,
      companyId,
    );
  }
}
