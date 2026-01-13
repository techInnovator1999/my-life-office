import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailRepository } from '../email.repository';
import { Email } from './entities/mail.entity';
import { EmailRelationalRepository } from './repositories/email.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Email])],
  providers: [
    {
      provide: EmailRepository,
      useClass: EmailRelationalRepository,
    },
  ],
  exports: [EmailRepository],
})
export class RelationalEmailPersistenceModule {}
