import { Injectable, BadRequestException } from '@nestjs/common';
import { CategoryRepository } from './category.repository';

@Injectable()
export class CategoryService {
  constructor(private repository: CategoryRepository) {}

  // 구분(Category) 목록
  async fetchManyCategory() {
    return await this.repository.findManyCategory();
  }

  // 구분(Category) id로 찾기
  async fetchCategoryById({ categoryId }: { categoryId?: number }) {
    const category = await this.repository.findCategory({
      id: categoryId,
    });

    // 찾는 category가 DB에 없을 경우 에러 처리
    if (!category) {
      throw new BadRequestException('Category does not exist...');
    }

    return category;
  }

  // 구분(Category) 이름으로 찾기
  async fetchCategoryByName({ categoryName }: { categoryName: string }) {
    const category = await this.repository.findCategory({
      name: categoryName,
    });
    // 찾는 category가 DB에 없을 경우 에러 처리
    if (!category) {
      throw new BadRequestException('Category does not exist...');
    }

    return category;
  }

  // 구분(Category) 생성
  async createCategory({ name }: { name: string }) {
    return await this.repository.insertCategory({ name });
  }

  // 구분(Category) 수정
  async modifyCategory({
    categoryId,
    name,
  }: {
    categoryId: number;
    name: string;
  }) {
    await this.fetchCategoryById({ categoryId });

    return await this.repository.updateCategory({
      where: { id: categoryId },
      data: { name },
    });
  }

  // 구분(Category) 삭제
  async removeCategory({ categoryId }: { categoryId: number }) {
    await this.fetchCategoryById({ categoryId });

    return await this.repository.deleteCategory({ id: categoryId });
  }
}
