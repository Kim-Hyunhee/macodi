import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StoreRepository {
  constructor(private prisma: PrismaService) {}

  async findStore(where: {
    id?: number;
    userName?: string;
    managerName?: string;
    email?: string;
    companyName?: string;
  }) {
    return await this.prisma.store.findFirst({
      where,
      include: { products: true },
    });
  }

  async insertStore(data: InsertStore) {
    return await this.prisma.store.create({ data });
  }

  async findManyStore({
    where,
    searchOption,
    filter,
  }: {
    where: { page: number };
    searchOption?: { keyword?: string };
    filter?: { item?: string; range?: string };
  }) {
    const PAGE_SIZE = 10;
    const skipAmount = (where.page - 1) * PAGE_SIZE;

    const whereCondition: {
      OR?: (
        | { companyName?: { contains: string } }
        | { userName?: { contains: string } }
        | { owner?: { contains: string } }
        | { managerNumber?: { contains: string } }
      )[];
    } = {};

    if (searchOption?.keyword) {
      const keyword = searchOption.keyword;

      whereCondition.OR = [
        { companyName: { contains: keyword } },
        { userName: { contains: keyword } },
        { owner: { contains: keyword } },
        { managerNumber: { contains: keyword } },
      ];
    }

    const orderBy: { [key: string]: 'asc' | 'desc' }[] = [];
    if (filter.item && filter.range) {
      if (
        filter.item === 'userName' ||
        filter.item === 'managerName' ||
        filter.item === 'companyName' ||
        filter.item === 'status'
      ) {
        orderBy.unshift({ [filter.item]: filter.range as 'asc' | 'desc' });
      }
    }

    const stores = await this.prisma.store.findMany({
      skip: skipAmount,
      take: PAGE_SIZE,
      where: whereCondition,
      include: {
        products: {
          include: {
            category: true,
            location: true,
            purpose: true,
            options: true,
          },
        },
      },
      orderBy,
    });

    const total = await this.prisma.store.count();
    const pageTotal = await this.prisma.store.count({ where: whereCondition });
    const productTotal = await this.prisma.product.count();
    const next = pageTotal - PAGE_SIZE * where.page < 0 ? null : where.page + 1;

    return { stores, total, productTotal, pageTotal, next };
  }

  async updateStore({
    where,
    data,
  }: {
    where: { id: number };
    data: UpdateStore;
  }) {
    return await this.prisma.store.update({ where, data });
  }

  async deleteStore(where: { id: number }) {
    return await this.prisma.store.delete({ where });
  }
}

export type InsertStore = {
  userName: string;
  password: string;
  email: string;
  managerNumber: string;
  contactNumber?: string;
  companyName: string;
  managerName: string;
  owner: string;
  address: string;
  factoryAddress?: string;
  storageAddress?: string;
  companySite?: string;
  license?: string;
};

export type UpdateStore = {
  userName?: string;
  password?: string;
  email?: string;
  contactNumber?: string;
  managerNumber?: string;
  companyName?: string;
  owner?: string;
  address?: string;
  factoryAddress?: string;
  storageAddress?: string;
  companySite?: string;
  license?: string;
  status?: boolean;
};
