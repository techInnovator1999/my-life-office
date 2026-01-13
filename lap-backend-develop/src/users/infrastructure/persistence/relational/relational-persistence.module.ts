import { Module } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { UsersRelationalRepository } from './repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserDeviceRelationalRepository } from './repositories/user-device.repository';
import { UserDeviceRepository } from '../user-device.repository';
import { UserDeviceEntity } from './entities/user-device.entity';
import { UserPreferenceRepository } from '../user-preference.repository';
import { UserPreferenceRelationalRepository } from './repositories/user-preference.repository';
import { UserPreferenceEntity } from './entities/user-preference.entity';
import { UserSuspensionRepository } from '../user-suspension.repository';
import { UserSuspensionRelationalRepository } from './repositories/user-suspension.repository';
import { UserSuspensionEntity } from './entities/user-suspension.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserDeviceEntity,
      UserPreferenceEntity,
      UserSuspensionEntity,
    ]),
  ],
  providers: [
    {
      provide: UserRepository,
      useClass: UsersRelationalRepository,
    },
    {
      provide: UserDeviceRepository,
      useClass: UserDeviceRelationalRepository,
    },
    {
      provide: UserPreferenceRepository,
      useClass: UserPreferenceRelationalRepository,
    },
    {
      provide: UserSuspensionRepository,
      useClass: UserSuspensionRelationalRepository,
    },
  ],
  exports: [
    UserRepository,
    UserDeviceRepository,
    UserPreferenceRepository,
    UserSuspensionRepository,
  ],
})
export class RelationalUserPersistenceModule {}
