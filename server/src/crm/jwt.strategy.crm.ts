import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import Admins from '../database/entity/admins.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategyCrm extends PassportStrategy(Strategy, 'jwt_crm') {
  constructor(@InjectRepository(Admins) private repoAdmin: Repository<Admins>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET,
    });
  }

  async validate(payload: { id: number; email: string }): Promise<Admins> {
    const user: Admins = await this.repoAdmin.findOneBy({
      id: payload.id,
    });

    if (
      !user ||
      user.crm_access_token === '' ||
      user.crm_access_token === null ||
      user.email !== payload.email
    ) {
      throw new UnauthorizedException('Unautorized user');
    }

    return user;
  }
}
