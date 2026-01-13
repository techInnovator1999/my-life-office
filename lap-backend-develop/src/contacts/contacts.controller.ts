import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  ParseUUIDPipe,
  Request,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { Contact } from './domain/contact';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@/roles/roles.guard';
import { UsersGuard } from '@/users/users.guard';
import { Roles } from '@/roles/roles.decorator';
import { RoleEnum } from '@/roles/roles.enum';
import { InfinityPaginationResultType } from '@/utils/types/infinity-pagination-result.type';
import { QueryContactDto } from './dto/query-contact.dto';
import { infinityPagination } from '@/utils/infinity-pagination';
import { FindAllContactDto } from './dto/find-all-contact.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard, UsersGuard)
@ApiTags('contacts')
@Controller({
  path: 'contacts',
  version: '1',
})
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @ApiOperation({ summary: 'Create a new contact.' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() data: CreateContactDto,
    @Request() req: any,
  ): Promise<Contact> {
    // If agentId is not provided, use the authenticated user's ID
    if (!data.agentId && req.user) {
      data.agentId = req.user.id;
    }
    return this.contactsService.create(data);
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @ApiOperation({ summary: 'Gets many contacts with pagination.' })
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Query() query: QueryContactDto,
    @Request() req: any,
  ): Promise<InfinityPaginationResultType<FindAllContactDto>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 100) {
      limit = 100;
    }

    query.filters ??= {};

    // If user is not admin, filter by their agentId
    if (req.user && req.user.role?.id !== RoleEnum.ADMIN) {
      query.filters.agentId = req.user.id;
    }

    const { total, data } = await this.contactsService.findManyWithPagination({
      filterOptions: query?.filters,
      sortOptions: query?.sort,
      paginationOptions: {
        page,
        limit,
      },
    });

    return infinityPagination(data, total, { page, limit });
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @ApiOperation({ summary: 'Finds a contact by id.' })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: Contact['id'],
  ): Promise<Contact | null> {
    return this.contactsService.findOneById(id);
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @ApiOperation({ summary: 'Updates a contact' })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: Contact['id'],
    @Body() payload: UpdateContactDto,
  ): Promise<Contact | null> {
    return this.contactsService.update(id, payload);
  }

  @Roles([RoleEnum.ADMIN, RoleEnum.ACCOUNT_MANAGER])
  @ApiOperation({ summary: 'Deletes a contact' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: Contact['id']): Promise<void> {
    return this.contactsService.hardDelete(id);
  }
}



