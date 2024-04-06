import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseOptions } from './database/db.connection';
import { CrmModule } from './crm/crm.module';
import { APP_PIPE } from '@nestjs/core';
import { ClientModule } from './client/client.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MongoModule } from './mongo/mongo.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({ useClass: DatabaseOptions }),
    ScheduleModule.forRoot(),
    CrmModule,
    ClientModule,
    MongoModule,
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) },
  ],
})
export class AppModule {}
