import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Cart from './cart.entity';
import Good from './goods.entity';

@Entity()
class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @ManyToOne(() => Good, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'goodId' })
  good: Good;

  @Column()
  quantity: number;
}

export default CartItem;
