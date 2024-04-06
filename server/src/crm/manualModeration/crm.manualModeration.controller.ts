import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CrmManualModerationService } from './crm.manualModeration.service';
import InterfaceReturn from 'src/intarfaces/IntarfaceReturn';
import { AdminGuard } from '../guards/admin.guard';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { generateResponseSchema } from 'src/swaggerSchemas/generateResponse';
import {
  GetAllLogsResponseSchema,
  GetAllManagersResponseSchema,
} from 'src/swaggerSchemas/crm.responsesData';

@ApiTags('CRM Manual moderation managers')
@ApiSecurity('CRM Admin')
@Controller('crm/manual')
@UseGuards(AdminGuard)
export class CrmManualModerationController {
  constructor(private crmManualModeration: CrmManualModerationService) {}

  @Get()
  @ApiResponse(
    generateResponseSchema(
      200,
      'Managers recived',
      GetAllManagersResponseSchema,
    ),
  )
  @ApiResponse(generateResponseSchema(404, 'Managers not found'))
  @ApiResponse(
    generateResponseSchema(500, 'Failed get managers: + error.message'),
  )
  @ApiOperation({
    summary: 'Get all managers',
  })
  getAllManagers(): Promise<InterfaceReturn> {
    return this.crmManualModeration.getAllManagers();
  }

  @Post()
  @ApiResponse(generateResponseSchema(201, 'Manager id:333 created'))
  @ApiResponse(
    generateResponseSchema(500, 'Failed creat manager:  + error.message'),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'ex@ex.com' },
      },
      required: ['email'],
    },
  })
  @ApiOperation({
    summary: 'Create new manager',
  })
  createManager(@Body('email') email: string): Promise<InterfaceReturn> {
    return this.crmManualModeration.createManager(email);
  }

  @Delete('/:id')
  @ApiResponse(generateResponseSchema(204, `Manager  deleted`))
  @ApiResponse(generateResponseSchema(404, 'Manager not founded in database'))
  @ApiResponse(
    generateResponseSchema(204, `Failed delete manager: + error.message`),
  )
  @ApiOperation({
    summary: 'Delete manager',
  })
  deleteManager(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<InterfaceReturn> {
    return this.crmManualModeration.deleteManager(id);
  }

  @Get('logs')
  @ApiResponse(
    generateResponseSchema(200, 'Recived logs', GetAllLogsResponseSchema),
  )
  @ApiResponse(generateResponseSchema(500, 'Failed get logs: + error.message'))
  @ApiQuery({ name: 'p', required: false, description: 'page' })
  @ApiQuery({ name: 'q', required: false, description: 'quantity per page' })
  @ApiOperation({
    summary: 'Get logs of all database operations',
  })
  getLogs(
    @Query('p') p: string,
    @Query('q') q: string,
  ): Promise<InterfaceReturn> {
    return this.crmManualModeration.getLogs(p, q);
  }
}
