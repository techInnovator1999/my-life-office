import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { StatusEnum } from '@/statuses/statuses.enum';
import { UsersService } from './users.service';

@Injectable()
export class UsersGuard implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = await this.userService.findOneById(request.user.id);
    // console.log('🚀 ~ UsersGuard ~ canActivate ~ user:', user);

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'User information is missing',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (user?.deactivatedAt && new Date(user?.deactivatedAt) < new Date()) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'User is deactivated',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isSuspended = await this.userService.isUserSuspended(user?.id);

    if (isSuspended) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'You are suspended',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (user?.status?.id === StatusEnum.INACTIVE) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'Please verify your account before signing in',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
