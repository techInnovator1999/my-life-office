import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Company } from '../domain/company';
import { MasterPaycode } from '@/master-paycode/domain/master-paycode';

export class CompanyMasterPaycodeInputDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsString()
  @IsOptional()
  value?: string | null;

  @IsOptional()
  @Type(() => Company)
  company?: Company;

  @IsOptional()
  @Type(() => MasterPaycode)
  masterPaycode?: MasterPaycode;
}

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompanyMasterPaycodeInputDto)
  companyMasterPaycodes: CompanyMasterPaycodeInputDto[];
}
