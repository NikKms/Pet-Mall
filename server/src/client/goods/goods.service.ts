import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Good from '../../database/entity/goods.entity';
import InterfaceReturn from 'src/intarfaces/IntarfaceReturn';
import { QueryParams } from 'src/intarfaces/queryParams';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';

@Injectable()
export class GoodsService {
  constructor(
    @InjectRepository(Good) private repoGood: Repository<Good>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheStore,
  ) {}

  async getAll(obj: QueryParams): Promise<InterfaceReturn> {
    const cacheKey = 'goods';
    let cachedGoods: Good[];

    try {
      cachedGoods = await this.cacheManager.get(cacheKey);
    } catch (error) {
      throw new InternalServerErrorException('Redis failed: ' + error.message);
    }

    if (cachedGoods) {
      return {
        status: 200,
        message: 'Received goods from cache',
        data: cachedGoods,
        total: cachedGoods.length,
      };
    }

    let sol: number;

    try {
      sol = await this.cacheManager.get('sol');
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed get sol: ' + error.message,
      );
    }

    const { p, q, appoint, tag, manufacture } = obj;
    const quant = q ? parseInt(q) : await this.repoGood.count();
    const skip = p ? (parseInt(p) - 1) * quant : 0;

    let query = this.repoGood
      .createQueryBuilder('good')
      .leftJoinAndSelect('good.manufacture', 'manufacture')
      .leftJoinAndSelect('good.appoint', 'appoint')
      .leftJoinAndSelect('good.tags', 'tags')
      .skip(skip)
      .take(quant);

    if (manufacture) {
      query = query.where('good.manufacture = :manufacture', { manufacture });
    }

    if (appoint) {
      query = query.andWhere('good.appoint = :appoint', { appoint });
    }

    let goods: Good[];
    try {
      goods = await query.getMany();

      if (tag) {
        goods = goods.filter((good) =>
          good.tags.some((tagItem) => tagItem.id === parseInt(tag)),
        );
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching goods: ' + error.message,
      );
    }

    const mapedGoods = goods.map((good) => {
      return {
        ...good,
        price: Math.ceil((sol as number) * good.price * 100) / 100,
      };
    });

    try {
      await this.cacheManager.set(cacheKey, mapedGoods, { ttl: 10 });
    } catch (error) {
      throw new InternalServerErrorException('Redis failed: ' + error.message);
    }

    return {
      status: 200,
      message: 'Received goods',
      data: mapedGoods,
      total: mapedGoods.length,
    };
  }
}
