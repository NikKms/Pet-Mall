import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../decorators/req.user.decorator';
import InterfaceReturn from '../../intarfaces/IntarfaceReturn';
import User from '../../database/entity/user.entity';
import { CartUpdDto } from '../dto/cartUpdDto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { generateResponseSchema } from 'src/swaggerSchemas/generateResponse';
import { GetCartResponseSchema } from 'src/swaggerSchemas/client.responseData';

@ApiTags('Cleint Cart')
@ApiBearerAuth()
@Controller('client/cart')
@UseGuards(AuthGuard())
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @ApiResponse(
    generateResponseSchema(200, 'Cart recived', GetCartResponseSchema),
  )
  @ApiResponse(generateResponseSchema(404, 'Cart not found'))
  @ApiResponse(generateResponseSchema(500, '{error spot} + error.message'))
  @ApiOperation({ summary: 'Get cart' })
  get(@GetUser() user: User): Promise<InterfaceReturn> {
    return this.cartService.get(user);
  }

  @Patch()
  @ApiResponse(generateResponseSchema(201, 'Cart updated'))
  @ApiResponse(generateResponseSchema(404, '{error spot} not found'))
  @ApiResponse(generateResponseSchema(500, '{error spot} + error.message'))
  @ApiOperation({ summary: 'Update cart' })
  update(
    @Body() body: CartUpdDto,
    @GetUser() user: User,
  ): Promise<InterfaceReturn> {
    return this.cartService.update(body, user);
  }

  @Delete()
  @ApiResponse(generateResponseSchema(204, 'Cart cleared'))
  @ApiResponse(generateResponseSchema(404, 'Cart not found'))
  @ApiResponse(generateResponseSchema(500, '{error spot} + error.message'))
  @ApiOperation({ summary: 'Clear cart' })
  clear(@GetUser() user: User): Promise<InterfaceReturn> {
    return this.cartService.clear(user);
  }
}
