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

export class PostCompanyLoginBody {
  @ApiProperty({ required: true, example: 'testcompany' })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ required: true, example: 'Test!123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class PostCheckOverlapEmail extends OmitType(PostCompanyLoginBody, [
  'password',
] as const) {}

export class PostSignUpCompanyBody {
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
  contactNumber: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  managerName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  managerNumber: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  site: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  license: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
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
  managerName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class PatchStatusBody {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}

export class PutCompanyBody {
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
  contactNumber: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  managerName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  managerNumber: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  site: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  license: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  job: string;
}

export class GetCompanyQuery {
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
    enum: ['userName', 'email', 'name', 'status'],
  })
  @IsOptional()
  item: string;

  @ApiProperty({ required: false, enum: ['asc', 'desc'] })
  @IsOptional()
  range: string;
}

export class postCompanyForgotPasswordBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  managerName: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class patchCompanyPasswordBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class PatchCompanyIsClosedBody {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isClosed: boolean;
}
