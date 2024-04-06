import { Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorators/req.user.decorator';
import User from '../../database/entity/user.entity';
import InterfaceReturn from 'src/intarfaces/IntarfaceReturn';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { generateResponseSchema } from 'src/swaggerSchemas/generateResponse';
import {
  CreateOrderResponseSchema,
  GetAllOrdersByUserResponseSChema,
} from 'src/swaggerSchemas/client.responseData';

@ApiTags('Client Order')
@ApiBearerAuth()
@Controller('client/order')
@UseGuards(AuthGuard())
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @ApiResponse(
    generateResponseSchema(201, 'Order created', CreateOrderResponseSchema),
  )
  @ApiResponse(generateResponseSchema(404, 'Cart not found'))
  @ApiResponse(generateResponseSchema(406, 'Cart is empty'))
  @ApiResponse(generateResponseSchema(500, '{error spot} + error.message'))
  @ApiOperation({ summary: 'Create order' })
  create(@GetUser() user: User): Promise<InterfaceReturn> {
    return this.orderService.create(user);
  }

  @Get()
  @ApiResponse(
    generateResponseSchema(
      200,
      'Recived orders',
      GetAllOrdersByUserResponseSChema,
    ),
  )
  @ApiResponse(generateResponseSchema(404, 'Orders not found'))
  @ApiResponse(
    generateResponseSchema(500, 'Failed get orders: + error.message,'),
  )
  @ApiOperation({ summary: 'Get all user orders' })
  getAll(@GetUser() user: User): Promise<InterfaceReturn> {
    return this.orderService.getAll(user);
  }

  @Patch('/:id')
  @ApiResponse(generateResponseSchema(201, 'Order Declined'))
  @ApiResponse(
    generateResponseSchema(406, 'Order declined or ipmpossible change status'),
  )
  @ApiResponse(
    generateResponseSchema(
      500,
      'No connection. Change status failed + error.message',
    ),
  )
  @ApiOperation({ summary: 'Decline order' })
  @ApiParam({ name: 'id', description: 'Order to declined' })
  changeStatus(
    @GetUser() user: User,
    @Param('id') id: number,
  ): Promise<InterfaceReturn> {
    return this.orderService.changeStatus(user, id);
  }
}
