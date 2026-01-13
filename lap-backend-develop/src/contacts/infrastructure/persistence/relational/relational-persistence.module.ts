import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactRepository } from '../contact.repository';
import { ContactEntity } from './entities/contact.entity';
import { ContactRelationalRepository } from './repositories/contact.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ContactEntity])],
  providers: [
    {
      provide: ContactRepository,
      useClass: ContactRelationalRepository,
    },
  ],
  exports: [ContactRepository],
})
export class RelationalPersistenceContactsModule {}



