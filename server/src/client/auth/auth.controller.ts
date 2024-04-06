import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClientAuthDto } from '../dto/signUpDto';
import InterfaceReturn from '../../intarfaces/IntarfaceReturn';
import { GetUser } from '../../decorators/req.user.decorator';
import User from '../../database/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { generateResponseSchema } from 'src/swaggerSchemas/generateResponse';
import {
  GetMeResponseSchema,
  SigUpResponseSchema,
  SignInClientResponseSchema,
} from 'src/swaggerSchemas/client.responseData';

@ApiTags('Client Auth')
@Controller('client/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiResponse(generateResponseSchema(201, 'User created', SigUpResponseSchema))
  @ApiResponse(generateResponseSchema(409, 'User already register'))
  @ApiResponse(generateResponseSchema(500, '{error spot} + error.message'))
  @ApiOperation({
    summary: 'Sign up',
    description:
      'create a connection in your frontend application and start listening to the event:  const socket = io("ws://host:port your server"); socket.on("connect", () => { const socketId = socket.id }); socket.on("change_status", (message) => {});',
  })
  @ApiQuery({ name: 'socketId', required: false })
  signUp(
    @Body() body: ClientAuthDto,
    @Query('socketId') socketId: string,
  ): Promise<InterfaceReturn> {
    return this.authService.signUp(body, socketId);
  }

  @Post('signin')
  @ApiResponse(
    generateResponseSchema(200, 'Login success', SignInClientResponseSchema),
  )
  @ApiResponse(generateResponseSchema(401, 'User or password not valid'))
  @ApiResponse(generateResponseSchema(500, '{error spot} + error.message'))
  @ApiQuery({ name: 'socketId', required: false })
  @ApiOperation({
    summary: 'Sign in',
    description:
      'create a connection in your frontend application and start listening to the event:  const socket = io("ws://host:port your server"); socket.on("connect", () => { const socketId = socket.id }); socket.on("change_status", (message) => {});',
  })
  signIn(
    @Body() body: ClientAuthDto,
    @Query('socketId') socketId: string,
  ): Promise<InterfaceReturn> {
    return this.authService.signIn(body, socketId);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Log out' })
  @ApiResponse(generateResponseSchema(200, 'Logout success'))
  @ApiResponse(generateResponseSchema(500, 'No connection: + error.message'))
  @UseGuards(AuthGuard())
  logOut(@GetUser() user: User): Promise<InterfaceReturn> {
    return this.authService.logOut(user);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiResponse(
    generateResponseSchema(201, 'SocketId updated', GetMeResponseSchema),
  )
  @ApiResponse(
    generateResponseSchema(500, 'SocketId not updated: + error.message'),
  )
  @ApiOperation({
    summary: 'Get me, refresh socketId',
    description:
      'create a connection in your frontend application and start listening to the event:  const socket = io("ws://host:port your server"); socket.on("connect", () => { const socketId = socket.id  }); socket.on("change_status", (message) => {});',
  })
  @ApiQuery({ name: 'socketId', required: false })
  @UseGuards(AuthGuard())
  getMe(
    @GetUser() user: User,
    @Query('socketId') socketId: string,
  ): Promise<InterfaceReturn> {
    return this.authService.getMe(user, socketId);
  }
}
