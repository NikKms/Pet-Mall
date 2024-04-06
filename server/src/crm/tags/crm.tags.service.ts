import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Tag from '../../database/entity/tag.entity';
import InterfaceReturn from 'src/intarfaces/IntarfaceReturn';
import { UpdateDto } from '../dto/updateDto';
import Admins from 'src/database/entity/admins.entity';

@Injectable()
export class CrmTagsService {
  constructor(@InjectRepository(Tag) private repoTags: Repository<Tag>) {}

  async getAll(): Promise<InterfaceReturn> {
    let data: Tag[];

    try {
      data = await this.repoTags.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed get tags: ' + error.message,
      );
    }

    if (!data) throw new NotFoundException('Tags not found');

    return {
      status: 200,
      message: 'Tags recived',
      data: data,
      total: data.length,
    };
  }

  async create(user: Admins, name: string): Promise<InterfaceReturn> {
    let data: Tag;

    try {
      data = await this.repoTags.findOneBy({ name });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed get tag: ' + error.message,
      );
    }

    if (data) throw new ConflictException('Tags already exist in database');

    const newTags = this.repoTags.create({
      name,
      managerId: user.id,
      role: user.role,
    });

    try {
      await this.repoTags.save(newTags);
    } catch (error) {
      throw new NotAcceptableException(`Error creating Tags:` + error.message);
    }

    return { status: 201, message: `Tags ${newTags.name}  created ` };
  }

  async update(
    user: Admins,
    body: UpdateDto,
    id: number,
  ): Promise<InterfaceReturn> {
    const { name } = body;
    let tag: Tag;

    try {
      tag = await this.repoTags.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException('Failed get tag:' + error.message);
    }

    if (!tag) throw new NotFoundException('Tag not founded');

    tag.name = name;
    tag.managerId = user.id;
    tag.role = user.role;

    try {
      await this.repoTags.save(tag);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update tag:' + error.message,
      );
    }

    return {
      status: 201,
      message: `Tag name updated to ${tag.name}`,
    };
  }

  async delete(id: number): Promise<InterfaceReturn> {
    let tag: Tag;

    try {
      tag = await this.repoTags.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException('Failed get tag:' + error.message);
    }

    if (!tag) throw new NotFoundException('Tag not found');

    try {
      await this.repoTags.remove(tag);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete tags:' + error.message,
      );
    }

    return { status: 204, message: 'Tags deleted successfully' };
  }
}
