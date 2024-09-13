import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductOptionRepository {
  constructor(private prisma: PrismaService) {}

  // 특정 제품 옵션(ProductOption) 정보 수정
  async updateProductOption({
    where,
    data,
  }: {
    where: { id: number };
    data: UpdateProductOption;
  }) {
    return await this.prisma.productOption.update({ where, data });
  }

  // 제품 옵션(ProductOption) 테이블에서 조건에 맞는 첫 번째 줄
  async findProductOption(where: { id: number }) {
    return await this.prisma.productOption.findUnique({
      where,
      include: { product: true },
    });
  }

  // 특정 제품 옵션 삭제
  async deleteProductOption(where: { id: number }) {
    return await this.prisma.productOption.delete({ where });
  }

  // 제품 옵션(ProductOption) 테이블에 여러 개 데이터 생성
  async insertManyProductOption({
    productId,
    data,
  }: {
    productId: number;
    data: { size: string; price: number }[];
  }) {
    const transaction = data.map(({ size, price }) => {
      return this.prisma.productOption.createMany({
        data: { size, price, productId },
      });
    });

    return await this.prisma.$transaction(transaction);
  }

  // 제품 옵션(ProductOption) 테이블에 데이터 생성
  async insertProductOption({
    productId,
    data,
  }: {
    productId: number;
    data: { size: string; price: number };
  }) {
    return await this.prisma.productOption.create({
      data: { ...data, productId },
    });
  }
}

export type UpdateProductOption = {
  size?: string;
  price?: number;
};
