import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  Request,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from '@/roles/roles.decorator';
import { RoleEnum } from '@/roles/roles.enum';
import { EmailTemplateService } from './email-template.service';
import { CreateEmailTemplateDto } from './dto/create-email-template.dto';
import { infinityPagination } from '@/utils/infinity-pagination';
import { InfinityPaginationResultType } from '@/utils/types/infinity-pagination-result.type';
import { EmailTemplate } from './domain/email-template';
import { GetEmailTemplateDto } from './dto/get-email-template.dto';
import { QueryEmailTemplateDto } from './dto/query-email-template.dto';
import { UpdateEmailTemplateDto } from './dto/update-email-template.dto';
import { GetAvailableTagsQueryDto } from './dto/get-available-tags-query.dto';
import { UsersGuard } from '@/users/users.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
@ApiTags('Email-Template')
@Controller({
  path: 'email-template',
  version: '1',
})
export class EmailTemplateController {
  constructor(private readonly emailTemplateService: EmailTemplateService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @ApiResponse({ type: CreateEmailTemplateDto })
  create(
    @Request() request,
    @Body() createEmail: CreateEmailTemplateDto,
  ): Promise<any> {
    return this.emailTemplateService.create(createEmail);
  }

  @Delete(':id')
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: EmailTemplate['id']): Promise<void> {
    return this.emailTemplateService.softDelete(id);
  }

  @Get()
  @ApiResponse({ type: GetEmailTemplateDto })
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Request() request,
    @Query() query: QueryEmailTemplateDto,
  ): Promise<InfinityPaginationResultType<GetEmailTemplateDto>> {
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
    };

    const { total, data } =
      await this.emailTemplateService.findManyWithPagination(filterOptions);

    return infinityPagination(data, total, { page, limit });
  }

  @Patch(':id')
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: UpdateEmailTemplateDto })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  public update(
    @Param('id') id: EmailTemplate['id'],
    @Body() updateEmailTemplateDto: UpdateEmailTemplateDto,
  ): Promise<boolean> {
    return this.emailTemplateService.update(id, updateEmailTemplateDto);
  }

  @Get('tags')
  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: [String] })
  GetAvailableTags(@Query() query: GetAvailableTagsQueryDto): string[] {
    return this.emailTemplateService.getAvailableTags(query.emailName);
  }
}
