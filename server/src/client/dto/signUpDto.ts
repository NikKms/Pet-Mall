import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ClientAuthDto {
  @ApiProperty({ default: 'example@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ default: 'qwerty123' })
  @IsNotEmpty()
  password: string;
}
