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
import { CrmManufactureService } from './crm.manufacture.service';
import InterfaceReturn from '../../intarfaces/IntarfaceReturn';
import { CrmGuard } from '../guards/crm.guard';
import { AdminGuard } from '../guards/admin.guard';
import { UpdateDto } from '../dto/updateDto';
import Admins from 'src/database/entity/admins.entity';
import { GetUser } from 'src/decorators/req.user.decorator';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { generateResponseSchema } from 'src/swaggerSchemas/generateResponse';
import { GetAllArrayTypeResponseSchema } from 'src/swaggerSchemas/crm.responsesData';

@ApiTags('CRM Manufacture')
@Controller('crm/manufacture')
@UseGuards(CrmGuard)
export class CrmManufactureController {
  constructor(private crmManufactureService: CrmManufactureService) {}

  @Get()
  @ApiSecurity('CRM')
  @ApiResponse(
    generateResponseSchema(
      200,
      'Manufacture received',
      GetAllArrayTypeResponseSchema,
    ),
  )
  @ApiResponse(generateResponseSchema(404, 'Manufacture not found'))
  @ApiResponse(
    generateResponseSchema(500, 'Failed get manufacture:+ error.message'),
  )
  @ApiOperation({
    summary: 'Get all list manufacture',
  })
  getAll(): Promise<InterfaceReturn> {
    return this.crmManufactureService.getAll();
  }

  @Post()
  @ApiSecurity('CRM')
  @ApiResponse(
    generateResponseSchema(201, 'Manufacture ${manufacture.name}  created'),
  )
  @ApiResponse(
    generateResponseSchema(409, 'Manufacture already exist in database'),
  )
  @ApiResponse(
    generateResponseSchema(406, 'Error creating manufacture: + error.message'),
  )
  @ApiResponse(
    generateResponseSchema(500, 'Failed get manufacture:  + error.message'),
  )
  @ApiOperation({
    summary: 'Create manufacture',
  })
  @ApiBody({
    description: 'Manufacture data',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'New manufacture',
        },
      },
      required: ['name'],
    },
  })
  create(
    @GetUser() user: Admins,
    @Body('name') name: string,
  ): Promise<InterfaceReturn> {
    return this.crmManufactureService.create(user, name);
  }

  @Patch('/:id')
  @ApiSecurity('CRM')
  @ApiResponse(
    generateResponseSchema(
      201,
      'Manufacture name updated to {manufacture.name}',
    ),
  )
  @ApiResponse(generateResponseSchema(404, 'Manufacture not founded'))
  @ApiResponse(generateResponseSchema(500, '{error spot} : + error.message'))
  @ApiOperation({
    summary: 'Change info manufacture by ID',
  })
  update(
    @GetUser() user: Admins,
    @Body() body: UpdateDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<InterfaceReturn> {
    return this.crmManufactureService.update(user, body, id);
  }

  @Delete('/:id')
  @ApiSecurity('CRM Admin')
  @ApiResponse(generateResponseSchema(204, 'Manufacture deleted successfully'))
  @ApiResponse(generateResponseSchema(404, 'Manufacture not found'))
  @ApiResponse(generateResponseSchema(500, '{error spot} : + error.message'))
  @ApiOperation({
    summary: 'Delete manufacture by ID',
    description: 'Delete permision only admin',
  })
  @UseGuards(AdminGuard)
  // @HttpCode(204)
  delete(@Param('id', ParseIntPipe) id: number): Promise<InterfaceReturn> {
    return this.crmManufactureService.delete(id);
  }
}
