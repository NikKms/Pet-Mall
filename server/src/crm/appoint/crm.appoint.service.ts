import {
  // ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Appoint from '../../database/entity/appoint.entity';
// import Good from '../../database/entity/goods.entity';
import InterfaceReturn from '../../intarfaces/IntarfaceReturn';
import { UpdateDto } from '../dto/updateDto';

import Admins from 'src/database/entity/admins.entity';

@Injectable()
export class CrmAppointService {
  constructor(
    @InjectRepository(Appoint) private repoAppoint: Repository<Appoint>,
    // @InjectRepository(Good) private repoGood: Repository<Good>,
  ) {}

  async getAll(): Promise<InterfaceReturn> {
    let data: Appoint[];

    try {
      data = await this.repoAppoint.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed get appoints: ' + error.message,
      );
    }

    if (!data) throw new NotFoundException('Appoint not found');

    return {
      status: 200,
      message: 'Appoint recived',
      data: data,
      total: data.length,
    };
  }

  async create(user: Admins, name: string): Promise<InterfaceReturn> {
    try {
      await this.repoAppoint.upsert(
        { name, managerId: user.id, role: user.role },
        {
          conflictPaths: ['name'],
          skipUpdateIfNoValuesChanged: true,
        },
      );
    } catch (error) {
      throw new NotAcceptableException(
        `Error creating appoint:` + error.message,
      );
    }

    // try {
    //   await this.modelLogs.create({
    //     userId: user.id,
    //     role: user.role,
    //     action: Action.CREATE,
    //     resource: Resource.APPOINT,
    //   });
    // } catch (error) {
    //   throw new InternalServerErrorException(
    //     'Dont write logs: ' + error.message,
    //   );
    // }

    return { status: 201, message: `Appoint ${name}  created ` };
    // let data: Appoint;
    // try {
    //   data = await this.repoAppoint.findOneBy({ name });
    // } catch (error) {
    //   throw new InternalServerErrorException(
    //     'Failed get appoint: ' + error.message,
    //   );
    // }
    // if (data) throw new ConflictException('Appoint already exist in database');
    // const newAppoint = this.repoAppoint.create({ name });
    // try {
    //   await this.repoAppoint.save(newAppoint);
    // } catch (error) {
    //   throw new NotAcceptableException(
    //     `Error creating appoint:` + error.message,
    //   );
    // }
    // return { status: 201, message: ` Appoint ${newAppoint.name}  created ` };
  }

  async update(
    user: Admins,
    body: UpdateDto,
    id: number,
  ): Promise<InterfaceReturn> {
    const { name } = body;

    try {
      await this.repoAppoint.update(id, {
        name,
        managerId: user.id,
        role: user.role,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update appoint:' + error.message,
      );
    }

    return {
      status: 201,
      message: `Appoint name updated to ${name}`,
    };

    // const { name } = body;
    // let appoint: Appoint;
    // try {
    //   appoint = await this.repoAppoint.findOne({ where: { id } });
    // } catch (error) {
    //   throw new InternalServerErrorException(
    //     'Failed get appoint: ' + error.message,
    //   );
    // }
    // if (!appoint) throw new NotFoundException('Appoint not founded');
    // appoint.name = name;
    // try {
    //   await this.repoAppoint.save(appoint);
    // } catch (error) {
    //   throw new InternalServerErrorException(
    //     'Failed to update appoint:' + error.message,
    //   );
    // }
    // return {
    //   status: 201,
    //   message: `Appoint name updated to ${appoint.name}`,
    // };
  }

  async delete(id: number): Promise<InterfaceReturn> {
    try {
      await this.repoAppoint.delete({ id });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete appoint:' + error.message,
      );
    }

    return { status: 204, message: `Appoint id:${id} deleted successfully` };
    //   let appoint: Appoint;

    //   try {
    //     appoint = await this.repoAppoint.findOne({ where: { id } });
    //   } catch (error) {
    //     throw new InternalServerErrorException(
    //       'Failed to update appoint:' + error.message,
    //     );
    //   }

    //   if (!appoint) throw new NotFoundException('Appoint not found');

    //   try {
    //     await this.repoGood.delete({ appoint });

    //     await this.repoAppoint.remove(appoint);
    //   } catch (error) {
    //     throw new InternalServerErrorException(
    //       'Failed to delete appoint:' + error.message,
    //     );
    //   }

    //   return { status: 204, message: 'Appoint deleted successfully' };
    // }
  }
}
