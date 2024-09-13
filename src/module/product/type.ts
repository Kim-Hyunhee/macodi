import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PostProductBody {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subCategory: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  storeId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  manufacturer: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  origin: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isShowPrice: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isShow: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  glossiness: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  locationId: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  purposeId: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  status: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  feature: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  url: string;

  @ApiProperty({ type: () => [PostProductOptionBody] })
  @IsArray()
  @IsOptional()
  options: PostProductOptionBody[];
}

export class PutProductBody {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  categoryId: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  subCategory: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  manufacturer: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  origin: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  country: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isShowPrice: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isShow: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  glossiness: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  locationId: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  purposeId: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  status: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  feature: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  url: string;
}

class PostProductOptionBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  size: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;
}

export class UpdateProductStatus {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}

export class DeleteProductBody {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  @Type(() => Number)
  ids: number[];
}

export class GetProductSearchBody {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  file: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  keyword: string;

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  @Type(() => Number)
  categoryIds: number[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  origin: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  locationId: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  purposeId: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  minPrice: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxPrice: number;

  @ApiProperty({
    required: false,
    enum: ['similarity', 'price', 'createdAt'],
  })
  @IsString()
  @IsOptional()
  item: string;

  @ApiProperty({ required: false, enum: ['asc', 'desc'] })
  @IsString()
  @IsOptional()
  range: string;
}

export class GetProductQuery {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  storeId: number;

  @ApiProperty({ required: false, enum: ['asc', 'desc'] })
  @IsString()
  @IsOptional()
  range: string;

  @ApiProperty({
    required: false,
    enum: [
      'categoryName',
      'purposeName',
      'locationName',
      'subCategory',
      'name',
      'manufacturer',
      'price',
      'origin',
      'code',
      'country',
      'isShowCost',
      'isShow',
      'status',
      'glossiness',
      'createdAt',
      'applyProject',
      'download',
      'sampleInquiry',
    ],
  })
  @IsString()
  @IsOptional()
  item: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  keyword: string;

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  @Type(() => Number)
  categoryIds: number[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  origin: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  locationId: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  purposeId: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  minPrice: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxPrice: number;
}

export class PostProductExcelUploadBody {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  storeId: number;
}
