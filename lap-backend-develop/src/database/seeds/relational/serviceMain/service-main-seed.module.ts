import { Module } from '@nestjs/common';
import { ServiceMainSeedService } from './service-main-seed.service';
import { RelationalServicesPersistenceModule } from '@/services/infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalServicesPersistenceModule],
  providers: [ServiceMainSeedService],
  exports: [ServiceMainSeedService],
})
export class ServiceMainSeedModule {}
