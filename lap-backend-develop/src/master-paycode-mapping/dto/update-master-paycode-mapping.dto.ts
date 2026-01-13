import { PartialType } from '@nestjs/swagger';
import { AssignMasterPaycodesDto } from './assign-master-paycodes.dto';

export class UpdateMasterPaycodeMappingDto extends PartialType(
  AssignMasterPaycodesDto,
) {}
