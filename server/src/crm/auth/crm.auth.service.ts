import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import User from '../../database/entity/user.entity';
import CrmAuthDto from '../dto/crmAuthDto';
import Admins, { UserRole } from '../../database/entity/admins.entity';
import InterfaceReturn from 'src/intarfaces/IntarfaceReturn';

@Injectable()
export class CrmAuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private repoUser: Repository<User>,
    @InjectRepository(Admins) private repoAdmins: Repository<Admins>,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    if (
      !process.env.ADMIN_PASSWORD &&
      process.env.ADMIN_PASSWORD === '' &&
      !process.env.ADMIN_EMAIL &&
      process.env.ADMIN_EMAIL === ''
    )
      return;

    const admin = await this.repoAdmins.findOne({
      where: { role: UserRole.ADMIN },
    });

    const hashPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    if (admin) {
      try {
        await this.repoAdmins.update(admin.id, {
          email: process.env.ADMIN_EMAIL,
          password: hashPassword,
        });

        return;
      } catch (error) {
        throw new InternalServerErrorException(
          'Failed update or create admin:' + error.message,
        );
      }
    }

    const newAdmin: Admins = this.repoAdmins.create({
      email: process.env.ADMIN_EMAIL,
      password: hashPassword,
      role: UserRole.ADMIN,
    });

    try {
      await this.repoAdmins.save(newAdmin);
      return;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed create new admin: ' + error.message,
      );
    }
  }

  async signIn(body: CrmAuthDto): Promise<InterfaceReturn> {
    const { email, password } = body;
    let user: Admins;

    try {
      user = await this.repoAdmins.findOne({ where: { email } });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed get admin:' + error.message,
      );
    }

    if (!user) throw new UnauthorizedException('email or password not valid');

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword)
      throw new UnauthorizedException('email or password not valid');

    const payload = { id: user.id, email: user.email };

    const token = this.jwtService.sign(payload, {
      secret: process.env.SECRET,
    });

    user.crm_access_token = token;

    try {
      await this.repoAdmins.update(user.id, { crm_access_token: token });
    } catch (error) {
      throw new InternalServerErrorException(
        'Login in crm failed:' + error.message,
      );
    }

    return {
      status: 200,
      message: 'Login in crm success',
      data: {
        email: user.email,
        jwt: user.crm_access_token,
        role: user.role,
      },
    };
  }

  async logOut(user: Admins): Promise<InterfaceReturn> {
    try {
      this.repoAdmins.update(user.id, { crm_access_token: '' });
    } catch (error) {
      throw new InternalServerErrorException('No connection:' + error.message);
    }

    return { status: 200, message: 'Logout success' };
  }
}
