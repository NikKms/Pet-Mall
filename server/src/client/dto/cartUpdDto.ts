import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CartUpdDto {
  @ApiProperty({ description: 'Good id', default: 55 })
  @IsNumber()
  @IsNotEmpty()
  goodId: number;

  @ApiProperty({ description: 'Quantity goods', default: 55 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
