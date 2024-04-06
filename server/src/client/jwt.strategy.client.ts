import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import User from '../database/entity/user.entity';

@Injectable()
export class JwtStrategyClient extends PassportStrategy(
  Strategy,
  'jwt_client',
) {
  constructor(@InjectRepository(User) private repoUser: Repository<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET,
    });
  }

  async validate(payload: { id: number; email: string }): Promise<User> {
    const user: User = await this.repoUser.findOneBy({
      id: payload.id,
    });

    if (
      !user ||
      user.access_token === '' ||
      user.access_token === null ||
      user.email !== payload.email
    ) {
      throw new UnauthorizedException('Unautorized user');
    }

    return user;
  }
}
