import { IsNumber, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PutProductOptionBody {
  @ApiProperty()
  @IsString()
  @IsOptional()
  size: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  price: number;
}

export class PostProductOptionBody {
  @ApiProperty()
  @IsString()
  size: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
