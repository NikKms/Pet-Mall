import CartItem from './cartItem.entity';
import User from './user.entity';
import { Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  cartItems: CartItem[];

  @OneToOne(() => User, (user) => user.cart)
  user: User;
}

export default Cart;
