import { RoleEntity } from 'src/roles/infrastructure/persistence/relational/entities/role.entity';
import { User } from '../../../../domain/user';
import { UserEntity } from '../entities/user.entity';
import { FileEntity } from 'src/files/infrastructure/persistence/relational/entities/file.entity';
import { StatusEntity } from 'src/statuses/infrastructure/persistence/relational/entities/status.entity';
import { FileMapper } from 'src/files/infrastructure/persistence/relational/mappers/file.mapper';
import { FindAllUserDto } from '@/users/dto/find-all-user.dto';
import { AccountManagerMapper } from '@/account-manager/persistence/relational/mappers/account-manager.mapper';
import { AccountManagerEntity } from '@/account-manager/persistence/relational/entities/account-manager.entity';
import { RegistrationTypeEnum } from '@/auth/registration-type.enum';

export class UserMapper {
  static toDomain(raw: UserEntity): User {
    const user = new User();
    user.id = raw.id;
    user.email = raw.email;
    user.password = raw.password;
    user.provider = raw.provider;
    user.isApproved = raw.isApproved;
    user.socialId = raw.socialId;
    user.firstName = raw.firstName;
    user.lastName = raw.lastName;
    user.metaData = raw.metaData;
    user.reference_code = raw.reference_code;
    user.previousPassword = raw.previousPassword;
    user.isShowToolTip = raw.isShowToolTip;
    user.heardBy = raw.heardBy;
    user.accountManagerStatus = raw.accountManagerStatus;
    user.defaultPromoCode = raw.defaultPromoCode;
    if (raw.photo) {
      user.photo = FileMapper.toDomain(raw.photo);
    }
    if (raw.accountManager) {
      user.accountManager = AccountManagerMapper.toDomain(raw.accountManager);
    }

    if (raw.role) {
      user.role = { id: raw.role.id };
    }
    user.status = raw?.status;
    user.lastLogin = raw?.lastLogin;
    user.rejectedAt = raw?.rejectedAt;
    user.archivedAt = raw?.archivedAt;
    user.waitingApprovalAt = raw?.waitingApprovalAt;
    user.approvedAt = raw?.approvedAt;
    user.createdAt = raw.createdAt;
    user.updatedAt = raw.updatedAt;
    user.deletedAt = raw.deletedAt;
    user.deactivatedAt = raw.deactivatedAt;
    user.deactivatedReason = raw.deactivatedReason;
    user.verificationCode = raw.verificationCode;
    user.verificationExpires = raw.verificationExpires;
    // CRM-specific fields
    user.mobile = raw.mobile;
    user.registrationType = raw.registrationType;
    user.primaryLicenseType = raw.primaryLicenseType;
    user.residentState = raw.residentState;
    user.licenseNumber = raw.licenseNumber;
    user.yearsLicensed = raw.yearsLicensed;
    user.priorProductsSold = raw.priorProductsSold;
    user.currentCompany = raw.currentCompany;
    user.googleAccessToken = raw.googleAccessToken;
    user.googleRefreshToken = raw.googleRefreshToken;
    user.googleTokenExpiry = raw.googleTokenExpiry;
    user.lastGoogleSyncAt = raw.lastGoogleSyncAt;
    user.sponsoringAgentId = raw.sponsoringAgentId;
    return user;
  }

  static toDomainMany(raw: UserEntity): FindAllUserDto {
    const user = new FindAllUserDto();
    user.id = raw.id;
    user.email = raw.email;
    user.status = raw.status;
    user.referralName = raw.referralName;
    user.firstName = raw.firstName;
    user.lastName = raw.lastName;
    user.lastLogin = raw.lastLogin;
    user.rejectedAt = raw.rejectedAt;
    user.approvedAt = raw.approvedAt;
    user.archivedAt = raw.archivedAt;
    user.waitingApprovalAt = raw.waitingApprovalAt;
    user.isApproved = raw.isApproved;
    user.heardBy = raw.heardBy;
    user.accountManagerStatus = raw.accountManagerStatus;
    user.defaultPromoCode = raw.defaultPromoCode;
    user.sumOfPayments = 0;
    if (raw.photo) {
      user.photo = FileMapper.toDomain(raw.photo);
    }
    if (raw.accountManager) {
      user.accountManager = AccountManagerMapper.toDomain(raw.accountManager);
    }
    user.reference_code = raw.reference_code;
    user.createdAt = raw.createdAt;
    user.deactivatedAt = raw.deactivatedAt;
    user.deactivatedReason = raw.deactivatedReason;
    user.verificationCode = raw.verificationCode;
    user.verificationExpires = raw.verificationExpires;
    return user;
  }

  static toPersistence(user: User): UserEntity {
    let role: RoleEntity | undefined = undefined;

    if (user.role) {
      role = new RoleEntity();
      role.id = user.role.id;
    }

    let photo: FileEntity | undefined = undefined;

    if (user.photo) {
      photo = new FileEntity();
      photo.id = user.photo.id;
    }

    let status: StatusEntity | undefined = undefined;

    if (user.status) {
      status = new StatusEntity();
      status.id = user.status.id;
    }

    const userEntity = new UserEntity();
    if (user.id && typeof user.id === 'number') {
      userEntity.id = user.id;
    }
    if (user.accountManager) {
      userEntity.accountManager = {
        id: user.accountManager.id,
      } as AccountManagerEntity;
    }
    userEntity.email = user.email;
    userEntity.password = user.password;
    userEntity.provider = user.provider;
    userEntity.socialId = user.socialId;
    userEntity.metaData = user.metaData;
    userEntity.firstName = user.firstName;
    userEntity.heardBy = user.heardBy;
    userEntity.lastName = user.lastName;
    userEntity.reference_code = user.reference_code;
    userEntity.photo = photo;
    userEntity.role = role;
    userEntity.status = status;
    userEntity.isApproved = user.isApproved;
    userEntity.accountManagerStatus = user.accountManagerStatus;
    userEntity.isShowToolTip = user.isShowToolTip;
    userEntity.rejectedAt = user.rejectedAt;
    userEntity.approvedAt = user.approvedAt;
    userEntity.archivedAt = user.archivedAt;
    userEntity.waitingApprovalAt = user.waitingApprovalAt;
    userEntity.defaultPromoCode = user.defaultPromoCode;
    userEntity.lastLogin = user.lastLogin;
    userEntity.createdAt = user.createdAt;
    userEntity.updatedAt = user.updatedAt;
    userEntity.deletedAt = user.deletedAt;
    userEntity.deactivatedAt = user.deactivatedAt;
    userEntity.deactivatedReason = user.deactivatedReason;
    userEntity.verificationCode = user.verificationCode;
    userEntity.verificationExpires = user.verificationExpires;
    userEntity.referralName = user.referralName;
    // CRM-specific fields
    userEntity.mobile = user.mobile;
    userEntity.registrationType = user.registrationType;
    userEntity.primaryLicenseType = user.primaryLicenseType;
    userEntity.residentState = user.residentState;
    userEntity.licenseNumber = user.licenseNumber;
    userEntity.yearsLicensed = user.yearsLicensed;
    userEntity.priorProductsSold = user.priorProductsSold;
    userEntity.currentCompany = user.currentCompany;
    userEntity.googleAccessToken = user.googleAccessToken;
    userEntity.googleRefreshToken = user.googleRefreshToken;
    userEntity.googleTokenExpiry = user.googleTokenExpiry;
    userEntity.lastGoogleSyncAt = user.lastGoogleSyncAt;
    userEntity.sponsoringAgentId = user.sponsoringAgentId;
    return userEntity;
  }
}
