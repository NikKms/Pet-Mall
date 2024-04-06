import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

class CrmAuthDto {
  @ApiProperty({ default: 'example@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ default: 'qwerty123' })
  @IsNotEmpty()
  password: string;
}

export default CrmAuthDto;
