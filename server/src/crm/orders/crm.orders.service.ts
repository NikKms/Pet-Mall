import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import Order from '../../database/entity/order.entity';
import InterfaceReturn from 'src/intarfaces/IntarfaceReturn';
import Admins from 'src/database/entity/admins.entity';

@Injectable()
export class CrmOrdersService {
  constructor(@InjectRepository(Order) private repoOrder: Repository<Order>) {}

  async getAll(): Promise<InterfaceReturn> {
    let orders: Order[];

    try {
      orders = await this.repoOrder
        .createQueryBuilder('orders')
        .leftJoinAndSelect('orders.orderItems', 'orderItems')
        .leftJoinAndSelect('orders.user', 'user')
        .select(['orders', 'orderItems', 'user.id', 'user.email'])
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching orders:  + ${error.message}`,
      );
    }

    return {
      status: 200,
      message: 'Recived all orders',
      data: orders,
      total: orders.length,
    };
  }

  async changeStatus(
    user: Admins,
    status: string,
    id: number,
  ): Promise<InterfaceReturn> {
    let changeStatus: UpdateResult;

    try {
      changeStatus = await this.repoOrder
        .createQueryBuilder()
        .update()
        .set({ status, managerId: user.id, role: user.role })
        .where('id = :id', { id })
        .andWhere('status != :status', { status })
        .execute();
    } catch (error) {
      throw new InternalServerErrorException(
        'No connection. Change status failed' + error.message,
      );
    }

    if (changeStatus.affected === 0)
      throw new NotAcceptableException('Failed to update status order');

    return {
      status: 201,
      message: `Status order change to ${status}`,
    };
  }
}
