import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Good from '../../database/entity/goods.entity';
import Manufacture from '../../database/entity/manufacture.entity';
import Appoint from '../../database/entity/appoint.entity';
import Tag from '../../database/entity/tag.entity';
import CreateGoodDto from '../dto/createGoodDto';
import ChangeGoodDto from '../dto/changeGoodDto';
import InterfaceReturn from 'src/intarfaces/IntarfaceReturn';
import { QueryParams } from 'src/intarfaces/queryParams';
import Admins from 'src/database/entity/admins.entity';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Client = require('ssh2-sftp-client');

@Injectable()
export class CrmGoodService {
  private sftpClient: any;

  constructor(
    @InjectRepository(Good) private repoGood: Repository<Good>,
    @InjectRepository(Manufacture)
    private repoManufacture: Repository<Manufacture>,
    @InjectRepository(Appoint) private repoAppoint: Repository<Appoint>,
    @InjectRepository(Tag) private repoTag: Repository<Tag>,
  ) {
    this.sftpClient = new Client();
  }

  async addGood(
    user: Admins,
    { name, price, manufacture, appoint, tags }: CreateGoodDto,
    file: Express.Multer.File,
  ): Promise<InterfaceReturn> {
    let good: Good;

    try {
      good = await this.repoGood.findOneBy({ name });
    } catch (error) {
      throw new InternalServerErrorException('No connection:' + error.message);
    }

    if (good) throw new ConflictException('Good already exist in database');

    const imgPath = file ? `/upload/${file.originalname}` : '';

    if (file) {
      try {
        await this.sftpClient.connect({
          host: 'localhost',
          port: 2222,
          username: 'pet-mall',
          password: 'password',
        });

        await this.sftpClient.put(file.buffer, imgPath);

        await this.sftpClient.end();
      } catch (error) {
        throw new InternalServerErrorException(
          'No connect to sftp: ' + error.message,
        );
      }
    }

    good = this.repoGood.create({
      name,
      price: parseFloat(price),
      image: imgPath,
      managerId: user.id,
      role: user.role,
    });

    try {
      good.manufacture = await this.repoManufacture.findOne({
        where: { name: manufacture },
      });

      if (!good.manufacture)
        throw new NotAcceptableException('Manufacture not found in database');

      good.appoint = await this.repoAppoint.findOne({
        where: { name: appoint },
      });

      if (!good.appoint)
        throw new NotAcceptableException('Appoint not found in database');

      if (tags) {
        if (typeof tags === 'string') tags = [tags];

        good.tags = await this.repoTag
          .createQueryBuilder()
          .where('name IN (:...tags)', { tags })
          .getMany();
      }
      await this.repoGood.save(good);
    } catch (error) {
      throw new NotAcceptableException('Error creating good: ' + error.message);
    }

    delete good.managerId;
    delete good.role;

    return { status: 201, message: 'Good created' };
  }

  async getAll(obj: QueryParams): Promise<InterfaceReturn> {
    const { p, q, appoint, tag, manufacture } = obj;

    let goods: Good[];

    const limit = q ? parseInt(q) : (await this.repoGood.find()).length;

    const skip = p ? (parseInt(p) - 1) * limit : 0;

    let queryBuilder = this.repoGood
      .createQueryBuilder('good')
      .leftJoinAndSelect('good.manufacture', 'manufacture.name')
      .leftJoinAndSelect('good.appoint', 'appoint.name')
      .leftJoinAndSelect('good.tags', 'tags')
      .skip(skip)
      .take(limit);

    if (manufacture) {
      queryBuilder = queryBuilder.where('good.manufacture = :manufacture', {
        manufacture,
      });
    }

    if (appoint) {
      queryBuilder = queryBuilder.andWhere('good.appoint = :appoint', {
        appoint,
      });
    }

    try {
      goods = await queryBuilder.getMany();
    } catch (error) {
      throw new InternalServerErrorException(
        `'Error fetching goods: ' + ${error.message}`,
      );
    }

    if (tag) {
      goods = goods.filter((good) => {
        return good.tags.some((tagItem) => tagItem.id === parseInt(tag));
      });
    }

    return {
      status: 200,
      message: 'Recived goods',
      data: goods,
      total: goods.length,
    };
  }

  async changeGood(
    user: Admins,
    body: ChangeGoodDto,
    id: number,
    file: Express.Multer.File,
  ): Promise<InterfaceReturn> {
    const { manufacture, appoint, tags, ...rest } = body;
    let good: Good;
    let newTags: string[];

    try {
      good = await this.repoGood.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed fetching good:' + error.message,
      );
    }

    if (!good) {
      throw new NotFoundException('Good not found');
    }

    try {
      if (manufacture) {
        const foundManufacture = await this.repoManufacture.findOne({
          where: { name: manufacture },
        });
        if (foundManufacture) {
          good.manufacture = foundManufacture;
        }
      }

      if (appoint) {
        const foundAppoint = await this.repoAppoint.findOne({
          where: { name: appoint },
        });
        if (foundAppoint) {
          good.appoint = foundAppoint;
        }
      }

      if (!tags) good.tags = [];

      if (tags && tags.length > 0) {
        if (typeof tags === 'string') {
          newTags = [tags];
        } else newTags = [...tags];

        const foundTags = await this.repoTag
          .createQueryBuilder()
          .where('name IN (:...tags)', { tags: newTags })
          .getMany();

        if (foundTags.length > 0) {
          good.tags = foundTags;
        }
      }

      const image = file ? `/upload/${file.originalname}` : good.image;

      if (file) {
        try {
          await this.sftpClient.connect({
            host: 'localhost',
            port: 2222,
            username: 'pet-mall',
            password: 'password',
          });

          await this.sftpClient.put(file.buffer, image);

          await this.sftpClient.end();
        } catch (error) {
          throw new InternalServerErrorException(
            'No connect to sftp: ' + error.message,
          );
        }
      }

      Object.assign(good, rest, { managerId: user.id, role: user.role, image });

      await this.repoGood.save(good);
    } catch (error) {
      throw new BadRequestException(`Failed to update good: ${error.message}`);
    }

    return { status: 201, message: 'Good updated' };
  }

  async deleteGood(id: number): Promise<InterfaceReturn> {
    let good: Good;

    try {
      good = await this.repoGood.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed get good:' + error.message,
      );
    }

    if (!good) throw new NotFoundException('Good not found');

    try {
      await this.repoGood.remove(good);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete good' + error.message,
      );
    }

    return { status: 204, message: 'Good deleted successfully' };
  }
}
