import {
  IsOptional,
  IsString,
  ValidateNested,
  IsUUID,
  IsArray,
  ValidateIf,
  IsDefined,
} from 'class-validator';
import { Type } from 'class-transformer';

class UpdateCompanyMasterPaycodeDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  value?: string;
}

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateCompanyMasterPaycodeDto)
  companyMasterPaycodes?: UpdateCompanyMasterPaycodeDto[];

  // ✅ Ensure at least one of name or companyMasterPaycodes is defined
  @ValidateIf((o) => !o.name && !o.companyMasterPaycodes)
  @IsDefined({
    message: 'At least name or companyMasterPaycodes must be provided',
  })
  dummyField?: any; // just a hack to trigger validation
}
