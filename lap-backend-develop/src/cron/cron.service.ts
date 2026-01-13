import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThan, Repository, In } from 'typeorm';
import moment from 'moment-timezone';
import { StatusEnum as StatusesEnum } from '@/statuses/statuses.enum';
import { RoleEnum } from '@/roles/roles.enum';
import { UserEntity } from '@/users/infrastructure/persistence/relational/entities/user.entity';
import { AccountManagerStatusEnum } from '@/users/users.enum';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@/mail/mail.service';
import { AllConfigType } from '@/config/config.type';

@Injectable()
export class CronService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private mailService: MailService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async markAccountManagerArchived() {
    await this.userRepository.update(
      {
        accountManagerStatus: AccountManagerStatusEnum.INVITED,
        createdAt: LessThan(moment().subtract(90, 'day').toDate()),
      },
      {
        accountManagerStatus: AccountManagerStatusEnum.ARCHIVED,
      },
    );
    console.log(
      `cron | markAccountManagerArchived | ${CronExpression.EVERY_DAY_AT_MIDNIGHT}`,
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  async checkUserDeactivated() {
    const users = await this.userRepository.find({
      where: {
        lastLogin: LessThan(moment().subtract(60, 'days').toDate()),
        deactivatedAt: IsNull(),
        role: In([RoleEnum.CLIENT, RoleEnum.ACCOUNT_MANAGER]),
        status: { id: StatusesEnum.ACTIVE },
      },
    });

    console.log(
      `cron | checkUserDeactivated | ${CronExpression.EVERY_DAY_AT_7AM} | ${users.length} users found`,
    );

    if (!users || users.length === 0) {
      return;
    }

    const promises = users.map(async (user) => {
      try {
        const payload = {
          status: { id: StatusesEnum.ABANDONED },
          deactivatedAt: null,
          deactivatedReason: null,
        };

        await this.userRepository.update(user.id, payload);

        // Send deactivation email
        await this.mailService.userAccountAbandonedEmail({
          to: user.email as string,
          cc: this.configService.getOrThrow('mail.supportAddress', {
            infer: true,
          }),
          data: {
            userName: user.firstName + ' ' + user.lastName,
          },
        });

        console.log(`Successfully processed user: ${user.id}`);
      } catch (error) {
        console.error(`Failed to process user: ${user.id}`, error);
      }
    });

    await Promise.all(promises);
  }
}
