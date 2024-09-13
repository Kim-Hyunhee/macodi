import {
  Controller,
  UseGuards,
  Body,
  Put,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRoleAndId } from 'src/decorators/userRoleAndId.decorator';
import { PutProductOptionBody } from './type';
import { ProductOptionService } from './product-option.service';

@ApiTags('productOption')
@ApiBearerAuth('access-token')
@Controller('productOption')
@UseGuards(JwtAuthGuard)
export class ProductOptionController {
  constructor(private productOptionService: ProductOptionService) {}

  // 특정 옵션 수정
  @Put('/:id')
  async putProductOption(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Body() body: PutProductOptionBody,
    @Param('id', ParseIntPipe) productOptionId: number,
  ) {
    const { role, id } = userRoleAndId;

    await this.productOptionService.modifyProductOption({
      [role + 'Id']: id,
      productOptionId,
      data: body,
    });

    return true;
  }

  // 특정 옵션 삭제
  @Delete('/:id')
  async deleteProductOption(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Param('id', ParseIntPipe) productOptionId: number,
  ) {
    const { role, id } = userRoleAndId;

    await this.productOptionService.removeProductOption({
      [role + 'Id']: id,
      productOptionId,
    });

    return true;
  }
}
