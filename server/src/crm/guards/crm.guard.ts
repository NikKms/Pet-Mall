import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../../database/entity/admins.entity';

@Injectable()
export class CrmGuard extends AuthGuard('jwt_crm') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user) {
    if (user?.role === UserRole.MANAGER || user?.role === UserRole.ADMIN) {
      return user;
    }

    throw new UnauthorizedException('You have not premissions');
  }
}
