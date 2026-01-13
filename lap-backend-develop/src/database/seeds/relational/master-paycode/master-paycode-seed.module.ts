import { MasterPaycodeEntity } from '@/master-paycode/infrastructure/persistence/relational/entities/master-paycode.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterPaycodeSeedService } from './master-paycode-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([MasterPaycodeEntity])],
  providers: [MasterPaycodeSeedService],
  exports: [MasterPaycodeSeedService],
})
export class MasterPaycodeSeedModule {}
