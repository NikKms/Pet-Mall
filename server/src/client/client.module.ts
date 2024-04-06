import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { CartService } from './cart/cart.service';
import { CartController } from './cart/cart.controller';
import { JwtModule } from '@nestjs/jwt';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { GoodsService } from './goods/goods.service';
import { GoodsController } from './goods/goods.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

import Cart from '../database/entity/cart.entity';
import User from '../database/entity/user.entity';
import Good from '../database/entity/goods.entity';
import Appoint from '../database/entity/appoint.entity';
import Manufacture from '../database/entity/manufacture.entity';
import Tag from '../database/entity/tag.entity';
import { JwtStrategyClient } from './jwt.strategy.client';
import Order from '../database/entity/order.entity';
import CartItem from '../database/entity/cartItem.entity';
import OrderItem from 'src/database/entity/orderItem.entity';
import { WsGateway } from 'src/ws/ws.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cart,
      User,
      Good,
      Appoint,
      Manufacture,
      Tag,
      Order,
      CartItem,
      OrderItem,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt_client' }),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '23h' },
    }),
  ],
  providers: [
    CartService,
    OrderService,
    GoodsService,
    AuthService,
    JwtStrategyClient,
    WsGateway,
  ],
  controllers: [
    CartController,
    OrderController,
    GoodsController,
    AuthController,
  ],
})
export class ClientModule {}
