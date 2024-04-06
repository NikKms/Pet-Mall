import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CrmAuthService } from './crm.auth.service';
import CrmAuthDto from '../dto/crmAuthDto';
import InterfaceReturn from 'src/intarfaces/IntarfaceReturn';
import { GetUser } from '../../decorators/req.user.decorator';
import Admins from '../../database/entity/admins.entity';
import { CrmGuard } from '../guards/crm.guard';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { generateResponseSchema } from 'src/swaggerSchemas/generateResponse';
import { CrmLoginResponseSchema } from 'src/swaggerSchemas/crm.responsesData';

@ApiTags('CRM Auth')
@Controller('crm/auth')
export class CrmAuthController {
  constructor(private crmAuthService: CrmAuthService) {}

  @Post('signin')
  @ApiResponse(
    generateResponseSchema(200, 'Login in CRM success', CrmLoginResponseSchema),
  )
  @ApiResponse(generateResponseSchema(401, 'email or password not valid'))
  @ApiResponse(generateResponseSchema(500, '{error spot}: + error.message'))
  @ApiOperation({
    summary: 'Sign in manager or admin',
  })
  signIn(@Body() body: CrmAuthDto) {
    return this.crmAuthService.signIn(body);
  }

  @Post('logout')
  @ApiSecurity('CRM')
  @ApiResponse(generateResponseSchema(200, 'Logout success'))
  @ApiResponse(generateResponseSchema(500, 'No connection: + error.message'))
  @ApiOperation({
    summary: 'Logout manager or admin',
  })
  @UseGuards(CrmGuard)
  logout(@GetUser() user: Admins): Promise<InterfaceReturn> {
    return this.crmAuthService.logOut(user);
  }
}
