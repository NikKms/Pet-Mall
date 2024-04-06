import {
  Body,
  Controller,
  Delete,
  Get,
  // HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CrmTagsService } from './crm.tags.service';
import InterfaceReturn from '../../intarfaces/IntarfaceReturn';
import { CrmGuard } from '../guards/crm.guard';
import { AdminGuard } from '../guards/admin.guard';
import { UpdateDto } from '../dto/updateDto';
import { GetUser } from 'src/decorators/req.user.decorator';
import Admins from 'src/database/entity/admins.entity';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { generateResponseSchema } from 'src/swaggerSchemas/generateResponse';
import { GetAllArrayTypeResponseSchema } from 'src/swaggerSchemas/crm.responsesData';

@ApiTags('CRM Tags')
@Controller('crm/tags')
@UseGuards(CrmGuard)
export class CrmTagsController {
  constructor(private crmTagsService: CrmTagsService) {}

  @Get()
  @ApiSecurity('CRM')
  @ApiResponse(
    generateResponseSchema(200, 'Tags received', GetAllArrayTypeResponseSchema),
  )
  @ApiResponse(generateResponseSchema(500, 'Failed get tags:  + error.message'))
  @ApiResponse(generateResponseSchema(404, 'Tags not found'))
  @ApiOperation({
    summary: 'Get all tags',
  })
  getAll(): Promise<InterfaceReturn> {
    return this.crmTagsService.getAll();
  }

  @Post()
  @ApiSecurity('CRM')
  @ApiResponse(generateResponseSchema(201, '`Tags ${newTags.name}  created `'))
  @ApiResponse(
    generateResponseSchema(406, 'Error creating Tags: + error.message'),
  )
  @ApiResponse(generateResponseSchema(409, 'Tags already exist in database'))
  @ApiResponse(generateResponseSchema(500, ' Failed get tag:  + error.message'))
  @ApiOperation({
    summary: 'Create new tag',
  })
  @ApiBody({
    description: 'Tags data',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'New Tag',
        },
      },
      required: ['name'],
    },
  })
  create(
    @GetUser() user: Admins,
    @Body('name') name: string,
  ): Promise<InterfaceReturn> {
    return this.crmTagsService.create(user, name);
  }

  @Patch('/:id')
  @ApiSecurity('CRM')
  @ApiResponse(generateResponseSchema(201, 'Tag name updated to ${tag.name}'))
  @ApiResponse(generateResponseSchema(404, 'Tag not founded'))
  @ApiResponse(generateResponseSchema(500, '{error spot}: + error.message'))
  @ApiOperation({
    summary: 'Change info by tag',
  })
  update(
    @GetUser() user: Admins,
    @Body() body: UpdateDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<InterfaceReturn> {
    return this.crmTagsService.update(user, body, id);
  }

  @Delete('/:id')
  @ApiSecurity('CRM Admin')
  @ApiResponse(generateResponseSchema(204, 'Tags deleted successfully'))
  @ApiResponse(generateResponseSchema(404, 'Tag not found'))
  @ApiResponse(generateResponseSchema(500, '{error spot}: + error.message'))
  @ApiOperation({
    summary: 'Delete tag by ID',
    description: 'Permission delete only admin',
  })
  @UseGuards(AdminGuard)
  // @HttpCode(204)
  delete(@Param('id', ParseIntPipe) id: number): Promise<InterfaceReturn> {
    return this.crmTagsService.delete(id);
  }
}
