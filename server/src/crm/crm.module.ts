import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Mongoose } from 'mongoose';
import { MongoModule } from '../mongo/mongo.module';

import { CrmGoodService } from './goods/crm.good.service';
import { CrmGoodsController } from './goods/crm.goods.controller';
import { CrmAuthService } from './auth/crm.auth.service';
import { CrmAppointController } from './appoint/crm.appoint.controller';
import { CrmAuthController } from './auth/crm.auth.controller';
import { CrmAppointService } from './appoint/crm.appoint.service';
import { CrmManufactureService } from './manufacture/crm.manufacture.service';
import { CrmManufactureController } from './manufacture/crm.manufacture.controller';
import { CrmTagsService } from './tags/crm.tags.service';
import { CrmTagsController } from './tags/crm.tags.controller';
import { CrmOrdersService } from './orders/crm.orders.service';
import { CrmOrdersController } from './orders/crm.orders.controller';
import { CrmManualModerationService } from './manualModeration/crm.manualModeration.service';
import { CrmManualModerationController } from './manualModeration/crm.manualModeration.controller';
import { JwtStrategyCrm } from './jwt.strategy.crm';
import { LogsSchema } from '../database/schema/logs.schema';

import Good from '../database/entity/goods.entity';
import Manufacture from '../database/entity/manufacture.entity';
import Appoint from '../database/entity/appoint.entity';
import Tag from '../database/entity/tag.entity';
import User from '../database/entity/user.entity';
import Cart from '../database/entity/cart.entity';
import Order from '../database/entity/order.entity';
import Admins from '../database/entity/admins.entity';
import { Subscriber } from '../database/subscribers/subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Good,
      Manufacture,
      Appoint,
      Tag,
      User,
      Cart,
      Order,
      Admins,
    ]),
    MongoModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '8h' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt_crm' }),
  ],
  providers: [
    CrmGoodService,
    CrmAuthService,
    CrmAppointService,
    CrmManufactureService,
    CrmTagsService,
    CrmOrdersService,
    CrmManualModerationService,
    JwtStrategyCrm,
    Admins,
    {
      provide: 'LOGS_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('Logs', LogsSchema),
      inject: ['DB_CONNECTION'],
    },
    Subscriber,
  ],
  controllers: [
    CrmGoodsController,
    CrmAuthController,
    CrmAppointController,
    CrmManufactureController,
    CrmTagsController,
    CrmOrdersController,
    CrmManualModerationController,
  ],
})
export class CrmModule {}
