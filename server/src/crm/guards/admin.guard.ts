import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../../database/entity/admins.entity';

@Injectable()
export class AdminGuard extends AuthGuard('jwt_crm') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user) {
    if (user?.role === UserRole.ADMIN) {
      return user;
    }

    throw new UnauthorizedException('Not admin');
  }
}
