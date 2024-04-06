import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../../database/entity/user.entity';
import { Repository } from 'typeorm';
import { ClientAuthDto } from '../dto/signUpDto';
import InterfaceReturn from 'src/intarfaces/IntarfaceReturn';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import Cart from '../../database/entity/cart.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private repoUser: Repository<User>,
    @InjectRepository(Cart) private repoCart: Repository<Cart>,
    private jwtService: JwtService,
  ) {}

  async signUp(
    body: ClientAuthDto,
    socketId: string,
  ): Promise<InterfaceReturn> {
    const { email, password } = body;
    let user: User;

    try {
      user = await this.repoUser.findOne({ where: { email } });
    } catch (error) {
      throw new InternalServerErrorException(
        'Not connection :' + error.message,
      );
    }

    if (user) {
      throw new ConflictException('User already register');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    user = this.repoUser.create({
      email,
      password: hashPassword,
      socketId,
    });

    try {
      user = await this.repoUser.save(user);

      const cart = this.repoCart.create({ user, cartItems: [] });

      await this.repoCart.save(cart);

      const token = this.jwtService.sign(
        { email, id: user.id },
        { secret: process.env.SECRET },
      );

      user.access_token = token;

      await this.repoUser.update(user.id, user);
    } catch (error) {
      throw new InternalServerErrorException(
        'Register failed:' + error.message,
      );
    }

    delete user.password;

    return {
      status: 201,
      message: 'User created',
      data: user,
    };
  }

  async signIn(
    body: ClientAuthDto,
    socketId: string,
  ): Promise<InterfaceReturn> {
    const { email, password } = body;
    let user: User;

    try {
      user = await this.repoUser.findOne({ where: { email } });
    } catch (error) {
      throw new InternalServerErrorException('No connection:' + error.message);
    }

    if (!user) throw new UnauthorizedException('User or password not valid');

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword)
      throw new UnauthorizedException('User or password not valid');

    const payload = { id: user.id, email: user.email };

    const token = this.jwtService.sign(payload, {
      secret: process.env.SECRET,
    });

    user.access_token = token;

    try {
      await this.repoUser.update(user.id, { access_token: token, socketId });
    } catch (error) {
      throw new InternalServerErrorException(
        'Login in crm failed:' + error.message,
      );
    }

    return {
      status: 200,
      message: 'Login success',
      data: {
        email: user.email,
        jwt: user.access_token,
        socketId: user.socketId,
      },
    };
  }

  async logOut(user: User): Promise<InterfaceReturn> {
    try {
      this.repoUser.update(user.id, { access_token: '', socketId: '' });
    } catch (error) {
      throw new InternalServerErrorException('No connection:' + error.message);
    }

    return { status: 200, message: 'Logout success' };
  }

  async getMe(user: User, socketId: string): Promise<InterfaceReturn> {
    const { id } = user;

    try {
      await this.repoUser.update(id, { socketId });
    } catch (error) {
      throw new InternalServerErrorException(
        'SocketId not updated:' + error.message,
      );
    }

    delete user.password;

    return {
      status: 201,
      message: 'SocketId updated',
      data: {
        email: user.email,
        socketID: user.socketId,
        jwt: user.access_token,
      },
    };
  }
}
