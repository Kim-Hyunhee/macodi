import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
  Delete,
  Patch,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRoleAndId } from 'src/decorators/userRoleAndId.decorator';
import {
  DeleteProductBody,
  GetProductQuery,
  GetProductSearchBody,
  PostProductBody,
  PostProductExcelUploadBody,
  PutProductBody,
  UpdateProductStatus,
} from './type';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from '../auth/admin.guard';
import { PostProductOptionBody } from '../product-option/type';

@ApiTags('product')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  // ai search로 찾은 제품 목록
  @Post('/search')
  async getManyProductSearch(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Body() body: GetProductSearchBody,
  ) {
    const { role, id } = userRoleAndId;

    return await this.productService.fetchManyProduct({
      [role + 'Id']: id,
      ...body,
    });
  }

  // 모든 제품 목록
  @Get()
  async getManyProduct(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Query() query: GetProductQuery,
  ) {
    const { role, id } = userRoleAndId;

    return await this.productService.fetchManyProduct({
      [role + 'Id']: id,
      ...query,
    });
  }

  // 제품 등록
  @Post()
  async postProduct(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Body() body: PostProductBody,
  ) {
    const { role, id } = userRoleAndId;
    const { storeId, ...other } = body;

    return await this.productService.createProduct({
      data: other,
      storeId: storeId || id,
      [role + 'Id']: id,
    });
  }

  // 특정 제품 수정
  @Put('/:id')
  async putProduct(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Body() body: PutProductBody,
    @Param('id', ParseIntPipe) productId: number,
  ) {
    const { role, id } = userRoleAndId;

    await this.productService.modifyProduct({
      data: body,
      productId,
      [role + 'Id']: id,
    });

    return true;
  }

  // 제품의 옵션 등록
  @Post('/:id/productOption')
  async postProductOption(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Body() { size, price }: PostProductOptionBody,
    @Param('id', ParseIntPipe) productId: number,
  ) {
    const { role, id } = userRoleAndId;

    return await this.productService.createProductOption({
      size,
      price,
      productId,
      [role + 'Id']: id,
    });
  }

  // 제품 삭제(여러 개 가능)
  @Delete()
  async deleteManyProduct(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Body() { ids }: DeleteProductBody,
  ) {
    const { role, id } = userRoleAndId;

    await this.productService.removeProduct({
      productIds: ids,
      [role + 'Id']: id,
    });

    return true;
  }

  // 특정 제품 상태값 변경
  @Patch('/:id/status')
  async patchProductStatus(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Param('id', ParseIntPipe) productId: number,
    @Body() { status }: UpdateProductStatus,
  ) {
    const { role, id } = userRoleAndId;

    await this.productService.modifyProductStatus({
      productId,
      status,
      [role + 'Id']: id,
    });

    return true;
  }

  // 특정 제품 상세보기
  @Get('/:id')
  async getProduct(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Param('id', ParseIntPipe) productId: number,
  ) {
    const { role, id } = userRoleAndId;

    return await this.productService.fetchProduct({
      productId,
      [role + 'Id']: id,
    });
  }

  // 관리자: 엑셀 파일로 제품 업로드
  @UseGuards(AdminGuard)
  @Post('/excel/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        storeId: { type: 'number' },
      },
    },
  })
  async postProductExcelUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body() { storeId }: PostProductExcelUploadBody,
  ) {
    try {
      const productInfoArray =
        await this.productService.convertCreateFileToJSON({
          file,
          storeId,
        });

      // DB에 정상적인 제품 추가
      for (const data of productInfoArray) {
        await this.productService.createProduct({
          data,
          storeId,
        });
      }

      return true;
    } catch (error) {
      throw error;
    }
  }
}
