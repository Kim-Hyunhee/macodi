import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PostUserLoginBody {
  @ApiProperty({ required: true, example: 'test' })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ required: true, example: 'test' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class PostCheckOverlapEmail extends OmitType(PostUserLoginBody, [
  'password',
] as const) {}

export class PostSignUpUserBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  companyName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  job: string;
}

export class PostForgotIdBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class PatchStatusBody {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}

export class PutUserBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  companyName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  job: string;
}

export class GetUserQuery {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  page: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  keyword: string;

  @ApiProperty({
    required: false,
    enum: ['userName', 'email', 'companyName'],
  })
  @IsOptional()
  item: string;

  @ApiProperty({ required: false, enum: ['asc', 'desc'] })
  @IsOptional()
  range: string;
}

export class postUserForgotPasswordBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class PatchUserPasswordBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class PatchUserIsClosedBody {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isClosed: boolean;
}
