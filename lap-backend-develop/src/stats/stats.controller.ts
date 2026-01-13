import {
  Controller,
  Get,
  UseGuards,
  HttpStatus,
  HttpCode,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { StatsService } from './stats.service';
import { Roles } from '@/roles/roles.decorator';
import { RoleEnum } from '@/roles/roles.enum';
import { StatsDto } from './dto/stats.dto';
import { UsersGuard } from '@/users/users.guard';

@ApiTags('Stats')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'stats',
  version: '1',
})
export class StatsController {
  constructor(private readonly statservice: StatsService) {}

  @Get('counts')
  @ApiBearerAuth()
  @ApiResponse({
    type: StatsDto,
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  async getTotalCounts(@Request() request) {
    return await this.statservice.getAllStats(request.user);
  }
}
