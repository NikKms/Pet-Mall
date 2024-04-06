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
import { CrmAppointService } from './crm.appoint.service';
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

@ApiTags('CRM Appoint')
@Controller('crm/appoint')
@UseGuards(CrmGuard)
export class CrmAppointController {
  constructor(private crmAppointService: CrmAppointService) {}

  @Get()
  @ApiSecurity('CRM')
  @ApiResponse(
    generateResponseSchema(
      200,
      'Appoint received',
      GetAllArrayTypeResponseSchema,
    ),
  )
  @ApiResponse(generateResponseSchema(404, 'Appoint not found'))
  @ApiResponse(
    generateResponseSchema(500, 'Failed get appoints:  + error.message'),
  )
  @ApiOperation({
    summary: 'Get all list appoints',
  })
  getAll(): Promise<InterfaceReturn> {
    return this.crmAppointService.getAll();
  }

  @Post()
  @ApiSecurity('CRM')
  @ApiResponse(generateResponseSchema(201, 'Appoint created successfully'))
  @ApiResponse(
    generateResponseSchema(406, 'Error creating appoint: + error.message'),
  )
  @ApiOperation({
    summary: 'Create appoint',
  })
  @ApiBody({
    description: 'Appoint data',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'New Appoint',
        },
      },
      required: ['name'],
    },
  })
  create(
    @GetUser() user: Admins,
    @Body('name') name: string,
  ): Promise<InterfaceReturn> {
    return this.crmAppointService.create(user, name);
  }

  @Patch('/:id')
  @ApiSecurity('CRM')
  @ApiResponse(generateResponseSchema(201, 'Appoint name updated successfully'))
  @ApiResponse(
    generateResponseSchema(500, 'Failed to update appoint: + error.message'),
  )
  @ApiOperation({
    summary: 'Change info appoint by ID',
  })
  update(
    @GetUser() user: Admins,
    @Body() body: UpdateDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<InterfaceReturn> {
    return this.crmAppointService.update(user, body, id);
  }

  @Delete('/:id')
  @ApiSecurity('CRM Admin')
  @ApiResponse(
    generateResponseSchema(204, 'Appoint id:${id} deleted successfully'),
  )
  @ApiResponse(
    generateResponseSchema(500, 'Failed to delete appoint: + error.message'),
  )
  @ApiOperation({
    summary: 'Delete appoint by ID',
    description: 'Delete permision only admin',
  })
  @UseGuards(AdminGuard)
  // @HttpCode(204)
  delete(@Param('id', ParseIntPipe) id: number): Promise<InterfaceReturn> {
    return this.crmAppointService.delete(id);
  }
}
