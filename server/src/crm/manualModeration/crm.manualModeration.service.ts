import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Admins, { UserRole } from '../../database/entity/admins.entity';
import { DeleteResult, InsertResult, Repository } from 'typeorm';
import User from '../../database/entity/user.entity';
import InterfaceReturn from 'src/intarfaces/IntarfaceReturn';
import { Model } from 'mongoose';
import Logs from 'src/database/schema/logs.schema';

@Injectable()
export class CrmManualModerationService {
  constructor(
    @InjectRepository(Admins) private repoAdmins: Repository<Admins>,
    @InjectRepository(User) private repoUser: Repository<User>,
    @Inject('LOGS_MODEL') private modelLogs: Model<Logs>,
  ) {}

  async getAllManagers(): Promise<InterfaceReturn> {
    let managers: Admins[];

    try {
      managers = await this.repoAdmins
        .createQueryBuilder('managers')
        .where('managers.role = :role', { role: UserRole.MANAGER })
        .select(['managers.id', 'managers.email', 'managers.role'])
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed get managers:' + error.message,
      );
    }

    if (!managers) throw new NotFoundException('Managers not found');

    return { status: 200, message: 'Managers recived', data: managers };
  }

  async createManager(email: string): Promise<InterfaceReturn> {
    let res: InsertResult;

    try {
      res = await this.repoAdmins
        .createQueryBuilder()
        .insert()
        .into(Admins)
        .values(
          await this.repoUser
            .createQueryBuilder('user')
            .where('user.email= :email', { email })
            .select(['user.email', 'user.password'])
            .getOne(),
        )
        .execute();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed creat manager: ' + error.message,
      );
    }

    // try {
    //   user = await this.repoUser.findOneBy({ email });
    // } catch (error) {
    //   throw new InternalServerErrorException(
    //     'Failed get user: ' + error.message,
    //   );
    // }

    // if (!user) throw new NotFoundException('User not found');

    // const manager = this.repoAdmins.create({
    //   email: user.email,
    //   password: user.password,
    // });

    // try {
    //   await this.repoAdmins.save(manager);
    // } catch (error) {
    //   throw new InternalServerErrorException(
    //     'Manager not created:' + error.message,
    //   );
    // }

    return {
      status: 201,
      message: `Manager id:${res.identifiers[0].id} created`,
    };
  }

  async deleteManager(id: number): Promise<InterfaceReturn> {
    let res: DeleteResult;

    try {
      res = await this.repoAdmins
        .createQueryBuilder()
        .delete()
        .from(Admins)
        .where('id = :id', { id })
        .execute();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed delete manager:' + error.message,
      );
    }

    if (res.affected === 0)
      throw new NotFoundException('Manager not founded in database');

    return { status: 204, message: `Manager  deleted` };
  }

  async getLogs(p: string, q: string): Promise<InterfaceReturn> {
    let logs: Logs[];

    const limit = q ? parseInt(q) : Infinity;

    const skip = p ? (parseInt(p) - 1) * limit : 0;

    try {
      logs = await this.modelLogs.find({}, '-updatedAt', {
        skip,
        limit,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed get logs:' + error.message,
      );
    }

    return {
      status: 200,
      message: 'Recived logs',
      data: { logs, total: logs.length },
    };
  }
}
