import Cart from './cart.entity';
import Order from './order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['email'])
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'email' })
  email: string;

  @Column()
  password: string;

  @Column({
    default: null,
  })
  access_token?: string;

  @Column({
    default: null,
  })
  socketId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatetAt: Date;

  @OneToOne(() => Cart, (cart) => cart.user)
  @JoinColumn()
  cart: Cart;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}

export default User;
