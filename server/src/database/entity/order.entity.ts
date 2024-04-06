import { UserRole } from './admins.entity';
import OrderItem from './orderItem.entity';
import User from './user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum StatusOrder {
  PENDING = 'pending',
  PROCESSING = 'processing',
  APPROVE = 'approve',
  DELIVERY = 'delivery',
  DONE = 'done',
  DECLINED = 'declined',
}

@Entity()
class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: StatusOrder,
    default: StatusOrder.PENDING,
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatetAt: Date;

  @Column({ select: false, default: null })
  managerId: number;

  @Column({ select: false, type: 'enum', enum: UserRole, default: null })
  role: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

  @ManyToOne(() => User, (user) => user.orders)
  user: User;
}

export default Order;
