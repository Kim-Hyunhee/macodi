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

export class PostStoreLoginBody {
  @ApiProperty({ required: true, example: 'test' })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ required: true, example: 'string' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class PostCheckOverlapEmail extends OmitType(PostStoreLoginBody, [
  'password',
] as const) {}

export class PostSignUpStoreBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  managerNumber: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  contactNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  managerName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  owner: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  factoryAddress: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  storageAddress: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  companySite: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  license: string;
}

export class PatchStatusBody {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}

export class GetStoreQuery {
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
    enum: ['companyName', 'userName', 'managerName', 'status'],
  })
  @IsOptional()
  item: string;

  @ApiProperty({ required: false, enum: ['asc', 'desc'] })
  @IsOptional()
  range: string;
}

export class PutStoreBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  managerNumber: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  contactNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  managerName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  owner: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  factoryAddress: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  storageAddress: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  companySite: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  license: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  status: boolean;
}

export class PutStoreMeBody extends OmitType(PutStoreBody, [
  'status',
] as const) {}

export class PostStoreForgotId {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class PostStoreForgotPassword {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class PatchStorePasswordBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
