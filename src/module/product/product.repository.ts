import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductRepository {
  constructor(private prisma: PrismaService) {}

  // 제품(Product) 테이블에서 조건에 맞는 배열
  async findManyProduct({
    where,
    searchOption,
    filter,
    storeId,
    userId,
    companyId,
    productIds,
    scores,
  }: {
    storeId?: number;
    userId?: number;
    companyId?: number;
    productIds: number[];
    scores?: number[];
    where: { page?: number };
    searchOption?: {
      categoryIds?: number[];
      origin?: string;
      locationIds?: number[];
      purposeIds?: number[];
      minPrice?: number;
      maxPrice?: number;
      keyword?: string;
    };
    filter?: { range?: string; item?: string };
  }) {
    const PAGE_SIZE = where.page ? 10 : undefined;
    const skipAmount = where.page ? (where.page - 1) * PAGE_SIZE : 0;

    const condition =
      userId || companyId
        ? { isShow: true, status: true, store: { status: true } }
        : {};

    const AND = [];
    if (storeId) {
      AND.push({ storeId });
    }

    const id = productIds.length > 0 ? { in: productIds } : undefined;

    const whereCondition: {
      categoryId?: { in: number[] };
      origin?: string;
      locationId?: { in: number[] };
      purposeId?: { in: number[] };
      price?: { gte?: number; lte?: number };
      OR?: [
        { name: { contains: string } },
        { code: { contains: string } },
        { subCategory: { contains: string } },
        { manufacturer: { contains: string } },
        { origin: { contains: string } },
        { country: { contains: string } },
        { glossiness: { contains: string } },
        { feature: { contains: string } },
        { category: { name: { contains: string } } },
        { options: { some: { size: { contains: string } } } },
      ];
    } = {};

    if (searchOption) {
      if (searchOption.categoryIds) {
        whereCondition.categoryId = { in: searchOption.categoryIds };
      }
      if (searchOption.origin) {
        whereCondition.origin = searchOption.origin;
      }
      if (searchOption.locationIds.length > 0) {
        whereCondition.locationId = { in: searchOption.locationIds };
      }
      if (searchOption.purposeIds.length > 0) {
        whereCondition.purposeId = { in: searchOption.purposeIds };
      }
      if (searchOption.keyword) {
        const searchWords = searchOption.keyword.split(' ');

        searchWords.map(
          (word) =>
            (whereCondition.OR = [
              { name: { contains: word } },
              { code: { contains: word } },
              { subCategory: { contains: word } },
              { manufacturer: { contains: word } },
              { origin: { contains: word } },
              { country: { contains: word } },
              { glossiness: { contains: word } },
              { feature: { contains: word } },
              { category: { name: { contains: word } } },
              { options: { some: { size: { contains: word } } } },
            ]),
        );
      }
      if (searchOption.minPrice || searchOption.maxPrice) {
        whereCondition.price = {
          gte: searchOption.minPrice,
          lte: searchOption.maxPrice,
        };
      }
    }

    let orderBy = {};

    if (filter.item && filter.range) {
      if (
        filter.item !== 'categoryName' &&
        filter.item !== 'purposeName' &&
        filter.item !== 'locationName' &&
        filter.item !== 'similarity'
      ) {
        orderBy = { [filter.item]: filter.range as 'asc' | 'desc' };
      }
    }

    const products = await this.prisma.product.findMany({
      skip: skipAmount,
      take: PAGE_SIZE,
      where: { ...whereCondition, AND, id, ...condition },
      include: {
        category: true,
        location: true,
        purpose: true,
        store: true,
        options: {
          include: {
            pins: {
              include: {
                scene: { include: { project: true } },
                inquiryPins: { include: { inquiry: true } },
              },
            },
          },
        },
      },
      orderBy,
    });

    if (filter.item === 'similarity') {
      const sortedProducts = productIds.map((id, index) => ({
        id,
        score: scores[index],
      }));

      const sortedResult = sortedProducts
        .map((productWithScore) => {
          const matchingProduct = products.find(
            (p) => p.id === productWithScore.id,
          );

          if (matchingProduct) {
            // matchingProduct가 정의되어 있을 때만 'score' 설정
            matchingProduct['score'] = productWithScore.score;
          }

          return matchingProduct;
        })
        .filter((product) => product !== undefined);

      return { products: sortedResult };
    }

    if (
      filter.item === 'categoryName' &&
      (filter.range === 'asc' || filter.range === 'desc')
    ) {
      products.sort((a, b) => {
        if (a.category.name < b.category.name) {
          return filter.range === 'asc' ? -1 : 1;
        } else if (a.category.name > b.category.name) {
          return filter.range === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      });
    } else if (
      filter.item === 'purposeName' &&
      (filter.range === 'asc' || filter.range === 'desc')
    ) {
      products.sort((a, b) => {
        if (a.purpose.name < b.purpose.name) {
          return filter.range === 'asc' ? -1 : 1;
        } else if (a.purpose.name > b.purpose.name) {
          return filter.range === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      });
    } else if (
      filter.item === 'locationName' &&
      (filter.range === 'asc' || filter.range === 'desc')
    ) {
      products.sort((a, b) => {
        if (a.location.name < b.location.name) {
          return filter.range === 'asc' ? -1 : 1;
        } else if (a.location.name > b.location.name) {
          return filter.range === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      });
    }

    if (userId) {
      for (const product of products) {
        for (const option of product.options) {
          option.price = 0;
        }
      }
    }

    const total = await this.prisma.product.count({
      where: { AND, ...whereCondition, id, ...condition },
    });

    const next = total - PAGE_SIZE * where.page < 0 ? null : where.page + 1;

    const pageNum = +Math.ceil(total / PAGE_SIZE);

    return { products, total, next, pageNum };
  }

  // 제품(Product) 테이블에서 조건에 맞는 첫 번째 줄
  async findProduct(where: { id: number }) {
    return await this.prisma.product.findFirst({
      where,
      include: {
        category: true,
        location: true,
        purpose: true,
        store: true,
        options: {
          include: {
            pins: {
              include: {
                scene: { include: { project: true } },
                inquiryPins: { include: { inquiry: true } },
              },
            },
          },
        },
      },
    });
  }
  // 제품(Product) 테이블에서 데이터 생성
  async insertProduct(data: InsertProduct) {
    return await this.prisma.product.create({ data });
  }

  // 특정 제품(Product) 정보 수정
  async updateProduct({
    where,
    data,
  }: {
    where: { id: number };
    data: UpdateProduct;
  }) {
    return await this.prisma.product.update({ data, where });
  }

  // 특정 제품(Product) 삭제
  async deleteProduct(where: { ids: number[] }) {
    return await this.prisma.product.deleteMany({
      where: { id: { in: where.ids } },
    });
  }

  // 제품(Product) 테이블의 모든 정보
  async findOnlyManyProduct() {
    return await this.prisma.product.findMany();
  }
}

export type InsertProduct = {
  categoryId: number;
  storeId: number;
  subCategory: string;
  name: string;
  code: string;
  image: string;
  manufacturer: string;
  origin: string;
  country: string;
  price: number;
  isShowPrice: boolean;
  isShow: boolean;
  glossiness: string;
  locationId?: number;
  purposeId?: number;
  status: boolean;
  feature?: string;
  url?: string;
};

export type UpdateProduct = {
  categoryId?: number;
  subCategory?: string;
  name?: string;
  image?: string;
  manufacturer?: string;
  origin?: string;
  country?: string;
  price?: number;
  isShowPrice?: boolean;
  isShow?: boolean;
  glossiness?: string;
  locationId?: number;
  purposeId?: number;
  status?: boolean;
  feature?: string;
  url?: string;
  applyProject?: number;
  sampleInquiry?: number;
  download?: number;
};
