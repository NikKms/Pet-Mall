import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import Order, { StatusOrder } from '../../database/entity/order.entity';
import User from '../../database/entity/user.entity';
import InterfaceReturn from '../../intarfaces/IntarfaceReturn';
import Cart from '../../database/entity/cart.entity';
import CartItem from 'src/database/entity/cartItem.entity';
import OrderItem from 'src/database/entity/orderItem.entity';
import { SchedulerRegistry } from '@nestjs/schedule';
import { WsGateway } from 'src/ws/ws.gateway';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private repoOrder: Repository<Order>,
    @InjectRepository(Cart) private repoCart: Repository<Cart>,
    @InjectRepository(CartItem) private repoCartItem: Repository<CartItem>,
    @InjectRepository(OrderItem) private repoOrderItem: Repository<OrderItem>,
    @InjectRepository(User) private repoUser: Repository<User>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheStore,
    private schedulerRegistry: SchedulerRegistry,
    private ws: WsGateway,
  ) {}

  private cronFactory(name: string, orderId: number) {
    const inteerval = setInterval(
      () => this.intervalChangeStatus(name, orderId),
      +process.env.CHANGE_STATUS_TIME,
    );

    this.schedulerRegistry.addInterval(name, inteerval);
  }

  private async intervalChangeStatus(name: string, orderId: number) {
    let order: Order;

    try {
      order = await this.repoOrder.findOne({ where: { id: orderId } });
    } catch (error) {
      throw new InternalServerErrorException(
        'No connect to order:' + error.message,
      );
    }

    if (!order) {
      if (this.schedulerRegistry.doesExist('interval', name)) {
        this.schedulerRegistry.deleteInterval(name);
      }
      throw new NotFoundException('Order not found');
    }

    const statusOrder = Object.values(StatusOrder);

    if (
      order.status === StatusOrder.DONE ||
      order.status === StatusOrder.DECLINED
    ) {
      this.schedulerRegistry.deleteInterval(name);
      return;
    }

    order.status =
      statusOrder[statusOrder.indexOf(order.status as StatusOrder) + 1];

    try {
      const user = await this.repoUser
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.orders', 'order')
        .where('order.id = :id', { id: orderId })
        .getOne();

      this.ws.sendMessageToClients(order.status, user.socketId);
      await this.repoOrder.save(order);
    } catch (error) {
      throw new InternalServerErrorException(
        'Dont changed status' + error.message,
      );
    }
  }

  async create(user: User): Promise<InterfaceReturn> {
    let cart: Cart;

    try {
      cart = await this.repoCart
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.user', 'user')
        .leftJoinAndSelect('cart.cartItems', 'cartItems')
        .leftJoinAndSelect('cartItems.good', 'good')
        .where('user.id = :user', { user: user.id })
        .getOne();
    } catch (error) {
      throw new InternalServerErrorException('No connection:' + error.message);
    }

    if (!cart) throw new NotFoundException('Cart not found');

    if (cart.cartItems.length === 0) {
      throw new NotAcceptableException('Cart is empty');
    }

    let order = this.repoOrder.create({ user });

    try {
      order = await this.repoOrder.save(order);
    } catch (error) {
      throw new InternalServerErrorException(
        'Order not created:' + error.message,
      );
    }

    let sol: number;

    try {
      sol = await this.cacheManager.get('sol');
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed get sol: ' + error.message,
      );
    }

    const orderItems = cart.cartItems.map((cartItem) => {
      return this.repoOrderItem.create({
        order,
        name: cartItem.good.name,
        price: Math.ceil((sol as number) * cartItem.good.price * 100) / 100,
        image: cartItem.good.image,
        quantity: cartItem.quantity,
      });
    });

    try {
      await this.repoOrderItem.save(orderItems);
    } catch (error) {
      throw new InternalServerErrorException(
        'Order not created:' + error.message,
      );
    }

    try {
      await this.repoCartItem.delete({ cart });
    } catch (error) {
      throw new InternalServerErrorException(
        'Cart not cleared:' + error.message,
      );
    }

    this.cronFactory(order.id.toString(), order.id);

    return {
      status: 201,
      message: 'Order created',
      data: { orderId: order.id },
    };
  }

  async getAll(user: User): Promise<InterfaceReturn> {
    let orders: Order[];

    try {
      orders = await this.repoOrder
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.orderItems', 'orderItems')
        .where('order.userId = :user', { user: user.id })
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed get orders:' + error.message,
      );
    }

    if (!orders) throw new NotFoundException('Orders not found');

    return { status: 200, message: 'Recived orders', data: orders };
  }

  async changeStatus(user: User, id: number): Promise<InterfaceReturn> {
    let changeStatus: UpdateResult;

    try {
      changeStatus = await this.repoOrder
        .createQueryBuilder()
        .update()
        .set({ status: StatusOrder.DECLINED })
        .where('user = :user', { user: user.id })
        .andWhere('id = :id', { id })
        .andWhere('status = :status', { status: StatusOrder.PENDING })
        .execute();
    } catch (error) {
      throw new InternalServerErrorException(
        'No connection. Change status failed' + error.message,
      );
    }

    if (changeStatus.affected === 0)
      throw new NotAcceptableException(
        'Order declined or ipmpossible change status',
      );

    const intervals = this.schedulerRegistry.getIntervals();

    if (intervals.includes(id.toString()))
      this.schedulerRegistry.deleteInterval(id.toString());

    return { status: 201, message: 'Order Declined' };
  }
}
