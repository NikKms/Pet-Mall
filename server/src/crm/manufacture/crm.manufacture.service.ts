import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import InterfaceReturn from 'src/intarfaces/IntarfaceReturn';
import Manufacture from '../../database/entity/manufacture.entity';
import Good from '../../database/entity/goods.entity';
import { UpdateDto } from '../dto/updateDto';
import Admins from 'src/database/entity/admins.entity';

@Injectable()
export class CrmManufactureService {
  constructor(
    @InjectRepository(Manufacture)
    private repoManufacture: Repository<Manufacture>,
    @InjectRepository(Good) private repoGood: Repository<Good>,
  ) {}

  async getAll(): Promise<InterfaceReturn> {
    let data: Manufacture[];

    try {
      data = await this.repoManufacture.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed get manufacture:' + error.message,
      );
    }

    if (!data) throw new NotFoundException('Manufacture not found');

    return {
      status: 200,
      message: 'Manufacture recived',
      data: data,
      total: data.length,
    };
  }

  async create(user: Admins, name: string): Promise<InterfaceReturn> {
    let data: Manufacture;

    try {
      data = await this.repoManufacture.findOneBy({ name });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed get manufacture: ' + error.message,
      );
    }

    if (data)
      throw new ConflictException('Manufacture already exist in database');

    const newManufacture = this.repoManufacture.create({
      name,
      managerId: user.id,
      role: user.role,
    });

    try {
      await this.repoManufacture.save(newManufacture);
    } catch (error) {
      throw new NotAcceptableException(
        `Error creating manufacture:` + error.message,
      );
    }

    return {
      status: 201,
      message: `Manufacture ${newManufacture.name}  created `,
    };
  }

  async update(
    user: Admins,
    body: UpdateDto,
    id: number,
  ): Promise<InterfaceReturn> {
    const { name } = body;
    let manufacture: Manufacture;

    try {
      manufacture = await this.repoManufacture.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed get manufacture:' + error.message,
      );
    }

    if (!manufacture) throw new NotFoundException('Manufacture not founded');

    manufacture.name = name;
    manufacture.managerId = user.id;
    manufacture.role = user.role;

    try {
      await this.repoManufacture.save(manufacture);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update manufacture:' + error.message,
      );
    }

    return {
      status: 201,
      message: `Manufacture name updated to ${manufacture.name}`,
    };
  }

  async delete(id: number): Promise<InterfaceReturn> {
    let manufacture: Manufacture;

    try {
      manufacture = await this.repoManufacture.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed get manufacture: ' + error.message,
      );
    }

    if (!manufacture) throw new NotFoundException('Manufacture not found');

    try {
      await this.repoGood.delete({ manufacture });

      await this.repoManufacture.remove(manufacture);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete manufacture:' + error.message,
      );
    }

    return { status: 204, message: 'Manufacture deleted successfully' };
  }
}
