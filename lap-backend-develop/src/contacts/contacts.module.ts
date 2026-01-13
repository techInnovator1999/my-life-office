import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { UsersModule } from '@/users/users.module';
import { RelationalPersistenceContactsModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalPersistenceContactsModule, UsersModule],
  controllers: [ContactsController],
  providers: [ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}



