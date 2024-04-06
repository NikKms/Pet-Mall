import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

class CreateGoodDto {
  @ApiProperty({ description: 'Name good', default: 'new good' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Multiplier price', default: 1.1 })
  @IsString()
  price: string;

  @ApiProperty({
    description: 'If need changed, value must be taken from the database',
  })
  @IsString()
  manufacture: string;

  @ApiProperty({
    description: 'If need changed, value must be taken from the database',
  })
  @IsString()
  appoint: string;

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

export default CreateGoodDto;
