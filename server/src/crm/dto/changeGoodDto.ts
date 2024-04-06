import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

class ChangeGoodDto {
  @ApiProperty({ default: 'Upd good name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Multiplier price',
    default: 1.1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'If need changed, value must be taken from the database',
    required: false,
  })
  @IsString()
  @IsOptional()
  manufacture?: string;

  @ApiProperty({
    description: 'If need changed, value must be taken from the database',
    required: false,
  })
  @IsString()
  @IsOptional()
  appoint?: string;

  @ApiProperty({
    type: [String],
    description: 'If need changed, value must be taken from the database',
    required: false,
  })
  @IsOptional()
  tags?: string[] | string;

  @ApiProperty({ type: String, format: 'binary', required: false })
  @IsOptional()
  file: string;
}

export default ChangeGoodDto;
