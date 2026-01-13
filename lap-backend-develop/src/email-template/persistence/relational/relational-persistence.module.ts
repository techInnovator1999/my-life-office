import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplateRepository } from '../email-template.repository';
import { EmailTemplateEntity } from './entities/email-template.entity';
import { EmailTemplateRelationalRepository } from './repositories/email-template.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EmailTemplateEntity])],
  providers: [
    {
      provide: EmailTemplateRepository,
      useClass: EmailTemplateRelationalRepository,
    },
  ],
  exports: [EmailTemplateRepository],
})
export class RelationalEmailTemplatePersistenceModule {}
