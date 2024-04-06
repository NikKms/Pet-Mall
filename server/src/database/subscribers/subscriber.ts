import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model } from 'mongoose';

import Logs, { Action, Resource } from 'src/database/schema/logs.schema';

import {
  EntityManager,
  EntitySubscriberInterface,
  InsertEvent,
  RemoveEvent,
  Repository,
  UpdateEvent,
} from 'typeorm';

import Admins, { UserRole } from '../entity/admins.entity';
import { InjectRepository } from '@nestjs/typeorm';

// @EventSubscriber()
@Injectable()
export class Subscriber implements EntitySubscriberInterface {
  constructor(
    private em: EntityManager,
    @Inject('LOGS_MODEL') private modelLogs: Model<Logs>,
    @InjectRepository(Admins) private repoAdmins: Repository<Admins>,
  ) {
    em.connection.subscribers.push(this);
  }

  private async logAction(
    userId: number,
    role: UserRole,
    action: Action,
    resource: string,
  ) {
    if (
      Object.values(Resource).includes(resource as Resource) &&
      userId &&
      Object.values(UserRole).includes(role as UserRole)
    )
      try {
        await this.modelLogs.create({ userId, role, action, resource });
      } catch (error) {
        throw new InternalServerErrorException('No connect:' + error.message);
      }
  }

  afterInsert(event: InsertEvent<any>) {
    if (
      event.metadata.tableName === 'user' ||
      event.metadata.tableName === 'cart' ||
      event.metadata.tableName === 'good_tags_tag'
    ) {
      return;
    }

    const { managerId, role } = event.entity;

    this.logAction(
      managerId,
      role as UserRole,
      Action.CREATE,
      event.metadata.tableName as Resource,
    );
  }

  afterUpdate(event: UpdateEvent<any>): void | Promise<any> {
    if (
      event.metadata.tableName === 'user' ||
      event.metadata.tableName === 'cart' ||
      event.metadata.tableName === 'good_tags_tag'
    ) {
      return;
    }

    const { managerId = null, role } = event.entity;

    this.logAction(
      managerId,
      role as UserRole,
      Action.UPDATE,
      event.metadata.tableName as Resource,
    );
  }

  async afterRemove(event: RemoveEvent<any>): Promise<any> {
    let admin: Admins;

    try {
      admin = await this.repoAdmins.findOne({
        where: { role: UserRole.ADMIN },
      });
    } catch (error) {}

    this.logAction(
      admin.id,
      UserRole.ADMIN,
      Action.DELETE,
      event.metadata.tableName as Resource,
    );
  }
}
