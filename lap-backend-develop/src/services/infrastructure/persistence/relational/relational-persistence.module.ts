import { ServiceMainRepository } from '../service-main.repository';
import { ServiceRelationalRepository } from './repositories/service-main.relational.repository';
import { SericeSubtypeRepository } from '../service-sub-type.repository';
import { ServiceSubRelationalRepository } from './repositories/service-sub-type.relational.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceMainEntity } from './entities/service-main.entity';
import { ServiceSubTypeEntity } from './entities/service-sub-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceMainEntity, ServiceSubTypeEntity]),
  ],
  providers: [
    {
      provide: ServiceMainRepository,
      useClass: ServiceRelationalRepository,
    },
    {
      provide: SericeSubtypeRepository,
      useClass: ServiceSubRelationalRepository,
    },
  ],
  exports: [ServiceMainRepository, SericeSubtypeRepository],
})
export class RelationalServicesPersistenceModule {}
