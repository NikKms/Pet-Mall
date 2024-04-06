import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CrmOrdersService } from './crm.orders.service';
import { StatusOrder } from '../../database/entity/order.entity';
import InterfaceReturn from '../../intarfaces/IntarfaceReturn';
import { CrmGuard } from '../guards/crm.guard';
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
import { GetAllOrdersResponseSchema } from 'src/swaggerSchemas/crm.responsesData';

@ApiTags('CRM Orders')
@ApiSecurity('CRM')
@Controller('crm/orders')
@UseGuards(CrmGuard)
export class CrmOrdersController {
  constructor(private crmOrders: CrmOrdersService) {}

  @Get()
  @ApiResponse(
    generateResponseSchema(
      200,
      'Recived all orders',
      GetAllOrdersResponseSchema,
    ),
  )
  @ApiResponse(
    generateResponseSchema(500, 'Error fetching orders:  + ${error.message}'),
  )
  @ApiOperation({
    summary: 'Get all orders',
  })
  getAll(): Promise<InterfaceReturn> {
    return this.crmOrders.getAll();
  }

  @Patch('/:id')
  @ApiResponse(generateResponseSchema(201, 'Status order change to ${status}'))
  @ApiResponse(generateResponseSchema(406, 'Failed to update status order'))
  @ApiResponse(
    generateResponseSchema(
      500,
      'No connection. Change status failed + error.message',
    ),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'processing' },
      },
      required: ['status'],
    },
  })
  @ApiOperation({
    summary: 'Change status order by ID',
    description:
      'possible options for changing status: pending, processing, approve, declined, delivery, done.',
  })
  changeStatus(
    @GetUser() user: Admins,
    @Body('status', new ParseEnumPipe(StatusOrder)) status: string,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<InterfaceReturn> {
    return this.crmOrders.changeStatus(user, status, id);
  }
}
