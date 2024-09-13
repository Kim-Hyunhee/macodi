import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PostProjectBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class PutProjectBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class GetProjectQuery {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  userId: number;
}
