import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateDto {
  @ApiProperty({ default: 'new name' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
