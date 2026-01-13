import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterPaycodeMappingEntity } from './entities/master-paycode-mapping.entity';
import { MasterPaycodeMappingRepository } from '../master-paycode-mapping.repository';
import { RelationalMasterPaycodeMappingRepository } from './repositories/master-paycode-mapping.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MasterPaycodeMappingEntity])],
  providers: [
    {
      provide: MasterPaycodeMappingRepository,
      useClass: RelationalMasterPaycodeMappingRepository,
    },
  ],
  exports: [MasterPaycodeMappingRepository],
})
export class RelationalPersistenceMasterPaycodeMappingModule {}
