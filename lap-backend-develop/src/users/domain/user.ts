import { Expose } from 'class-transformer';
import { FileType } from '@/files/domain/file';
import { Role } from '@/roles/domain/role';
import { Status } from '@/statuses/domain/status';
import { ApiProperty } from '@nestjs/swagger';
import { AccountManagerStatusEnum, HeardByEnum } from '../users.enum';
import { AccountManager } from '@/account-manager/domain/account-manager';
import { RegistrationTypeEnum } from '@/auth/registration-type.enum';

export class UserBase {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  email: string | null;

  @ApiProperty({ type: String })
  firstName?: string | null;

  @ApiProperty({ type: String })
  lastName?: string | null;

  @ApiProperty({ type: Status })
  status?: Status;

  @ApiProperty({ type: String })
  referralName?: string | null;

  @ApiProperty({ type: Boolean })
  isShowToolTip?: boolean | null;

  @ApiProperty({ type: String })
  reference_code?: string | null;

  @ApiProperty({ type: String })
  metaData?: string | null;

  @ApiProperty({ enum: HeardByEnum })
  heardBy?: string | null;

  @ApiProperty({ type: String })
  defaultPromoCode?: string | null;

  @ApiProperty({ type: String })
  deactivatedReason?: string | null;

  @ApiProperty({ type: Date })
  rejectedAt?: Date | null;
  approvedAt?: Date | null;
  waitingApprovalAt?: Date | null;
  archivedAt?: Date | null;
  lastLogin?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  deactivatedAt?: Date | null;
}

export class User extends UserBase {
  password?: string;

  previousPassword?: string;

  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @Expose({ groups: ['me', 'admin'] })
  socialId?: string | null;

  @ApiProperty({ type: FileType })
  photo?: FileType | null;

  accountManager?: AccountManager | null;

  @ApiProperty({ type: Role })
  role?: Role | null;

  @ApiProperty({ type: Status })
  status?: Status;

  @ApiProperty()
  isApproved: boolean = false;

  @ApiProperty({ type: String })
  verificationCode?: string | null;

  @ApiProperty({ type: String })
  verificationExpires?: Date | null;

  @ApiProperty({ enum: AccountManagerStatusEnum })
  accountManagerStatus?: string | null;

  // CRM-specific fields
  @ApiProperty({ type: String })
  mobile?: string | null;

  @ApiProperty({ enum: RegistrationTypeEnum })
  registrationType?: RegistrationTypeEnum | null;

  @ApiProperty({ type: String })
  primaryLicenseType?: string | null;

  @ApiProperty({ type: String })
  residentState?: string | null;

  @ApiProperty({ type: String })
  licenseNumber?: string | null;

  @ApiProperty({ type: Number })
  yearsLicensed?: number | null;

  @ApiProperty({ type: String })
  priorProductsSold?: string | null;

  @ApiProperty({ type: String })
  currentCompany?: string | null;

  @ApiProperty({ type: String })
  googleAccessToken?: string | null;

  @ApiProperty({ type: String })
  googleRefreshToken?: string | null;

  @ApiProperty({ type: Date })
  googleTokenExpiry?: Date | null;

  @ApiProperty({ type: Date })
  lastGoogleSyncAt?: Date | null;

  @ApiProperty({ type: String })
  sponsoringAgentId?: string | null;
}
