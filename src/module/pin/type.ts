import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PostPinBody {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  sceneId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  xCoordinate: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  yCoordinate: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  productOptionId: number;
}

export class DeletePinBody {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  @Type(() => Number)
  ids: number[];
}

export class PostExcelDownloadBody {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  @Type(() => Number)
  ids: number[];
}
