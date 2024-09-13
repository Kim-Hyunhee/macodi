import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryRepository {
  constructor(private prisma: PrismaService) {}

  // 구분(Category) 테이블에서 조건에 맞는 배열
  async findManyCategory() {
    return await this.prisma.category.findMany();
  }

  // 구분(Category) 테이블에서 조건에 맞는 첫 번째 줄
  async findCategory(where: { id?: number; name?: string }) {
    return await this.prisma.category.findFirst({ where });
  }

  // 구분(Category) 테이블에 정보 저장
  async insertCategory(data: { name: string }) {
    return await this.prisma.category.create({ data });
  }

  // 구분(Category) 테이블에서 해당 id 정보 변경
  async updateCategory({
    where,
    data,
  }: {
    where: { id: number };
    data: { name: string };
  }) {
    return await this.prisma.category.update({ where, data });
  }

  // 구분(Category) 테이블에서 해당 id 삭제
  async deleteCategory(where: { id: number }) {
    return await this.prisma.category.delete({ where });
  }
}
