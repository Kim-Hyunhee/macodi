import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PostSceneBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  projectId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  position: number;
}

export class PutSceneBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  image: string;
}

export class ScenePositionBody {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  sceneId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  position: number;
}

export class PatchManyScenePositionBody {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  projectId: number;

  @ApiProperty({ type: () => [ScenePositionBody] })
  @IsArray()
  @IsNotEmpty()
  data: ScenePositionBody[];
}
