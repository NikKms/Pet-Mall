import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import Admins from '../database/entity/admins.entity';
import User from '../database/entity/user.entity';

export const GetUser = createParamDecorator(
  (
    data: string | undefined,
    context: ExecutionContext,
  ): Promise<Admins | User> => {
    const req = context.switchToHttp().getRequest();

    if (data) return req.user[data];

    return req.user;
  },
);
