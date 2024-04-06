import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CrmGoodService } from './crm.good.service';
import CreateGoodDto from '../dto/createGoodDto';
import ChangeGoodDto from '../dto/changeGoodDto';
import InterfaceReturn from '../../intarfaces/IntarfaceReturn';
import { CrmGuard } from '../guards/crm.guard';
import { AdminGuard } from '../guards/admin.guard';
import { GetUser } from 'src/decorators/req.user.decorator';
import Admins from 'src/database/entity/admins.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { generateResponseSchema } from 'src/swaggerSchemas/generateResponse';
import { GetAllGoodsResponseSchema } from 'src/swaggerSchemas/crm.responsesData';

@ApiTags('CRM Goods')
@Controller('crm/goods')
@UseGuards(CrmGuard)
export class CrmGoodsController {
  constructor(private crmGoodService: CrmGoodService) {}

  @Post()
  @ApiSecurity('CRM')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Add new goods',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse(generateResponseSchema(201, 'Good created'))
  @ApiResponse(generateResponseSchema(409, 'Good already exist in database'))
  @ApiResponse(generateResponseSchema(500, '{error spot}: + error.message'))
  @ApiResponse(
    generateResponseSchema(
      406,
      'Error creating good: {relation} not found in database',
    ),
  )
  @UseInterceptors(FileInterceptor('file'))
  addGood(
    @GetUser() user: Admins,
    @Body() body: CreateGoodDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<InterfaceReturn> {
    return this.crmGoodService.addGood(user, body, file);
  }

  @Get()
  @ApiSecurity('CRM')
  @ApiOperation({
    summary: 'Get all goods',
  })
  @ApiResponse(
    generateResponseSchema(200, 'Received goods', GetAllGoodsResponseSchema),
  )
  @ApiResponse(
    generateResponseSchema(500, 'Error fetching goods:  + error.message'),
  )
  @ApiQuery({ name: 'p', required: false, description: 'Number page ' })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'quantity per page ',
  })
  @ApiQuery({
    name: 'appoint',
    required: false,
    description: 'id appoint',
  })
  @ApiQuery({
    name: 'tag',
    required: false,
    description: 'id tag',
  })
  @ApiQuery({
    name: 'manufacture',
    required: false,
    description: 'id manufacture',
  })
  getAllGoods(
    @Query('p') p: string,
    @Query('q') q: string,
    @Query('appoint') appoint: string,
    @Query('tag') tag: string,
    @Query('manufacture') manufacture: string,
  ): Promise<InterfaceReturn> {
    return this.crmGoodService.getAll({ p, q, appoint, tag, manufacture });
  }

  @Patch('/:id')
  @ApiSecurity('CRM')
  @ApiConsumes('multipart/form-data')
  @ApiResponse(generateResponseSchema(201, 'Good updated'))
  @ApiResponse(
    generateResponseSchema(400, 'Failed to update good: + error.message'),
  )
  @ApiResponse(generateResponseSchema(404, 'Good not Found'))
  @ApiResponse(generateResponseSchema(500, '{error spot}: + error.message'))
  @ApiOperation({
    summary: 'Change goods info',
    description: 'Change info by good ID',
  })
  @UseInterceptors(FileInterceptor('file'))
  changeGood(
    @GetUser() user: Admins,
    @Body() body: ChangeGoodDto,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<InterfaceReturn> {
    return this.crmGoodService.changeGood(user, body, id, file);
  }

  @Delete('/:id')
  @ApiSecurity('CRM Admin')
  @ApiResponse(generateResponseSchema(204, 'Good deleted successfully'))
  @ApiResponse(generateResponseSchema(404, 'Good not found'))
  @ApiResponse(generateResponseSchema(500, '{error spot}: + error.message'))
  @ApiOperation({
    summary: 'Delete goods ',
    description: 'Delete by good ID, permission only Admin',
  })
  @UseGuards(AdminGuard)
  deleteGood(@Param('id', ParseIntPipe) id: number): Promise<InterfaceReturn> {
    return this.crmGoodService.deleteGood(id);
  }
}
