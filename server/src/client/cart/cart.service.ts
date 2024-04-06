import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Cart from '../../database/entity/cart.entity';
import { Repository } from 'typeorm';
import InterfaceReturn from 'src/intarfaces/IntarfaceReturn';
import User from '../../database/entity/user.entity';
import Good from '../../database/entity/goods.entity';
import CartItem from '../../database/entity/cartItem.entity';
import { CartUpdDto } from '../dto/cartUpdDto';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private repoCart: Repository<Cart>,
    @InjectRepository(CartItem) private repoCartItem: Repository<CartItem>,
    @InjectRepository(Good) private repoGood: Repository<Good>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheStore,
  ) {}

  async get(user: User): Promise<InterfaceReturn> {
    let cart: Cart;
    let cartItems: CartItem[];

    try {
      cart = await this.repoCart
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.user', 'user')
        .leftJoinAndSelect('cart.cartItems', 'cartItems')
        .where('user.id = :user', { user: user.id })
        .getOne();
    } catch (error) {
      throw new InternalServerErrorException('No connection' + error.message);
    }

    if (!cart) throw new NotFoundException('Cart not found');

    try {
      cartItems = await this.repoCartItem
        .createQueryBuilder('item')
        // .leftJoinAndSelect('item.cart', 'cart')
        .leftJoinAndSelect('item.good', 'good')
        .where('item.cart = :cart', { cart: cart.id })
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException('No connection:' + error.message);
    }

    let sol: number;

    try {
      sol = await this.cacheManager.get('sol');
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed get sol: ' + error.message,
      );
    }

    const mapedCartItems = cartItems.map((item) => {
      return {
        ...item,
        good: {
          ...item.good,
          price: Math.ceil((sol as number) * item.good.price * 100) / 100,
        },
      };
    });

    return { status: 200, message: 'Cart recived', data: mapedCartItems };
  }

  async update(body: CartUpdDto, user: User): Promise<InterfaceReturn> {
    const { goodId, quantity } = body;
    let cart: Cart;
    let good: Good;

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

    const goodInCart = cart.cartItems.some((item) => item.good.id === goodId);

    if (goodInCart) {
      try {
        await this.repoCartItem
          .createQueryBuilder()
          .update(CartItem)
          .set({ quantity: () => `quantity + ${quantity}` })
          .where('good.id = :goodId', { goodId })
          .andWhere('cart = :cart', { cart: cart.id })
          .execute();
      } catch (error) {
        throw new InternalServerErrorException(
          'Failed update good in cart:' + error.message,
        );
      }

      return { status: 201, message: 'Cart updated' };
    }

    try {
      good = await this.repoGood.findOne({ where: { id: goodId } });
    } catch (error) {
      throw new InternalServerErrorException('No connection:' + error.message);
    }

    if (!good) {
      throw new NotFoundException('Good not found');
    }

    try {
      await this.repoCartItem
        .createQueryBuilder()
        .insert()
        .into(CartItem)
        .values({ cart, good, quantity })
        .execute();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed add good in cart:' + error.message,
      );
    }

    return { status: 201, message: 'Cart updated' };
  }

  async clear(user: User): Promise<InterfaceReturn> {
    let cart: Cart;

    try {
      cart = await this.repoCart
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.user', 'user')
        .where('user.id = :user', { user: user.id })
        .getOne();
    } catch (error) {
      throw new InternalServerErrorException(
        'Get cart failed:' + error.message,
      );
    }

    if (!cart) throw new NotFoundException('Cart not found');

    try {
      await this.repoCartItem.delete({ cart });
    } catch (error) {
      throw new InternalServerErrorException('Deleted failed:' + error.message);
    }

    return { status: 204, message: 'Cart cleared' };
  }
}
