import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Put,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/admin.guard';
import { CategoryDTO } from './type';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('category')
@ApiBearerAuth('access-token')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  // 구분(Category) 목록
  @Get()
  async getManyCategory() {
    return await this.categoryService.fetchManyCategory();
  }

  // 구분(Category) 생성
  @UseGuards(AdminGuard)
  @Post()
  async postCategory(@Body() { name }: CategoryDTO) {
    return await this.categoryService.createCategory({ name });
  }

  // 구분(Category) 수정
  @UseGuards(AdminGuard)
  @Put('/:id')
  async putCategory(
    @Body() { name }: CategoryDTO,
    @Param('id', ParseIntPipe) categoryId: number,
  ) {
    await this.categoryService.modifyCategory({ name, categoryId });

    return true;
  }

  // 구분(Category) 삭제
  @UseGuards(AdminGuard)
  @Delete('/:id')
  async deleteCategory(@Param('id', ParseIntPipe) categoryId: number) {
    await this.categoryService.removeCategory({ categoryId });

    return true;
  }
}
