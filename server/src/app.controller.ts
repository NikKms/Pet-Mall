import { Controller, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER) private redis: CacheStore,
  ) {}

  @EventPattern('get_sol')
  // @CacheKey('sol')
  // @CacheTTL(10)
  async getSol(@Payload() data: any) {
    try {
      await this.redis.set('sol', parseFloat(data.sol));
    } catch (error) {
      console.error('Redis failed : ' + error.message);
    }
  }
}
