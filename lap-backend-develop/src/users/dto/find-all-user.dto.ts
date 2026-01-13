import { Plan } from '@/plan/domain/plan';
import { ApiProperty } from '@nestjs/swagger';
import { UserBase } from '../domain/user';
import { FileType } from '@/files/domain/file';
import { AccountManager } from '@/account-manager/domain/account-manager';

export class FindAllUserDto extends UserBase {
  @ApiProperty({ type: [Plan] })
  plans?: Plan[];

  @ApiProperty()
  carts?: number;

  @ApiProperty()
  state?: string;

  @ApiProperty({ type: FileType })
  photo?: FileType | null;

  @ApiProperty()
  provider: string;

  @ApiProperty()
  accountManager?: AccountManager | null;

  @ApiProperty()
  onboardingDate?: Date | null;

  @ApiProperty()
  marital_status?: string;

  @ApiProperty()
  isApproved: boolean;

  @ApiProperty()
  partnerStatus?: string | null;

  @ApiProperty()
  accountManagerStatus?: string | null;

  @ApiProperty()
  partnerStatusNote?: string | null;

  @ApiProperty()
  sumOfPayments: number;

  @ApiProperty()
  verificationCode: string | null | undefined;

  @ApiProperty()
  verificationExpires: Date | null | undefined;
}
