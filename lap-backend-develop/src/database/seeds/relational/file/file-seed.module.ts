import { Module } from '@nestjs/common';
import { FileSeedService } from './file-seed.service';

@Module({
  providers: [FileSeedService],
  exports: [FileSeedService],
})
export class FileSeedModule {}
