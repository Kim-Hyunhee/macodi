import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class idInfo {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  pinId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  squareMeasure: number;
}

export class PostInquiryBody {
  @ApiProperty({ type: [idInfo] })
  @IsArray()
  @IsNotEmpty()
  pinIdInfo: idInfo[];

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  projectId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  receiver: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contactNumber: string;
}

export class DeleteInquiryBody {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  @Type(() => Number)
  ids: number[];
}

export class GetInquiryQuery {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  projectId: number;
}

export class GetManyInquiryPinQuery {
  @ApiProperty({ example: '2023-09-01', required: false })
  @IsOptional()
  startDate: Date;

  @ApiProperty({ example: '2023-09-30', required: false })
  @IsOptional()
  endDate: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  page: number;

  @ApiProperty({ required: false })
  @IsOptional()
  keyword: string;

  @ApiProperty({
    required: false,
    enum: [
      'receiver',
      'companyName',
      'address',
      'productName',
      'inquiryNumber',
      'createdAt',
    ],
  })
  @IsOptional()
  item: string;

  @ApiProperty({ required: false })
  @IsOptional()
  range: string;
}

export class PatchInquiryPinComplete {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isCompleted: boolean;
}
