import { forwardRef, Module } from '@nestjs/common';
import { RelationalEmailTemplatePersistenceModule } from './persistence/relational/relational-persistence.module';
import { EmailTemplateController } from './email-template.controller';
import { EmailTemplateService } from './email-template.service';
import { MailModule } from '@/mail/mail.module';
import { MailerModule } from '@/mailer/mailer.module';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [
    RelationalEmailTemplatePersistenceModule,
    MailerModule,
    forwardRef(() => UsersModule),
    forwardRef(() => MailModule),
  ],
  controllers: [EmailTemplateController],
  providers: [EmailTemplateService],
  exports: [EmailTemplateService, RelationalEmailTemplatePersistenceModule],
})
export class EmailTemplateModule {}
