import { Controller, Get, Query } from '@nestjs/common';
import { GoodsService } from './goods.service';
import InterfaceReturn from '../../intarfaces/IntarfaceReturn';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { generateResponseSchema } from 'src/swaggerSchemas/generateResponse';
import { GetAllGoodsResponseSchema } from 'src/swaggerSchemas/client.responseData';

@Controller('client')
export class GoodsController {
  constructor(private goodsService: GoodsService) {}

  @Get('goods')
  @ApiResponse(
    generateResponseSchema(200, 'Goods recived', GetAllGoodsResponseSchema),
  )
  @ApiResponse(generateResponseSchema(500, '{error spot} + error.message'))
  @ApiQuery({ name: 'p', required: false, description: 'page' })
  @ApiQuery({ name: 'q', required: false, description: 'quantity per page' })
  @ApiTags('Cleint Goods')
  @ApiQuery({ name: 'appoint', required: false })
  @ApiQuery({ name: 'tag', required: false })
  @ApiQuery({ name: 'manufacture', required: false })
  @ApiOperation({ summary: 'Get all goods' })
  getAll(
    @Query('p') p: string,
    @Query('q') q: string,
    @Query('appoint') appoint: string,
    @Query('tag') tag: string,
    @Query('manufacture') manufacture: string,
  ): Promise<InterfaceReturn> {
    return this.goodsService.getAll({ p, q, appoint, tag, manufacture });
  }
}
