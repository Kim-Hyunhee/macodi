import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async insertUser(data: InsertUser) {
    return await this.prisma.user.create({ data });
  }

  async findUser({
    id,
    userName,
    name,
    email,
  }: {
    id?: number;
    userName?: string;
    name?: string;
    email?: string;
  }) {
    return await this.prisma.user.findFirst({
      where: { id, userName, name, email },
      include: {
        projects: true,
      },
    });
  }

  async findManyUser({
    where,
    searchOption,
    filter,
  }: {
    where: { page: number };
    searchOption?: { keyword?: string };
    filter?: { item?: string; range?: string };
  }) {
    const whereCondition: {
      OR?: (
        | { companyName?: { contains: string } }
        | { userName?: { contains: string } }
        | { name?: { contains: string } }
        | { phoneNumber?: { contains: string } }
      )[];
    } = {};

    if (searchOption?.keyword) {
      const keyword = searchOption.keyword;

      whereCondition.OR = [
        { companyName: { contains: keyword } },
        { userName: { contains: keyword } },
        { name: { contains: keyword } },
        { phoneNumber: { contains: keyword } },
      ];
    }
    const PAGE_SIZE = 10;
    const skipAmount = (where.page - 1) * PAGE_SIZE;

    const orderBy: { [key: string]: 'asc' | 'desc' }[] = [];
    if (filter.item && filter.range) {
      if (
        filter.item === 'userName' ||
        filter.item === 'email' ||
        filter.item === 'companyName'
      ) {
        orderBy.unshift({ [filter.item]: filter.range as 'asc' | 'desc' });
      }
    }

    const users = await this.prisma.user.findMany({
      skip: skipAmount,
      take: PAGE_SIZE,
      where: whereCondition,
      include: { projects: true },
      orderBy,
    });

    const userTotal = await this.prisma.user.count();
    const pageTotal = await this.prisma.user.count({ where: whereCondition });
    const next = pageTotal - PAGE_SIZE * where.page < 0 ? null : where.page + 1;

    return { users, userTotal, pageTotal, next };
  }

  async updateUser({
    where,
    data,
  }: {
    where: { id: number };
    data: UpdateUser;
  }) {
    return await this.prisma.user.update({ where, data });
  }

  async deleteUser(where: { id: number }) {
    return await this.prisma.user.delete({ where });
  }
}

export type InsertUser = {
  userName: string;
  password: string;
  name: string;
  phoneNumber: string;
  email: string;
  companyName?: string;
  address?: string;
  job: string;
};

export type UpdateUser = {
  userName?: string;
  password?: string;
  name?: string;
  phoneNumber?: string;
  email?: string;
  companyName?: string;
  address?: string;
  job?: string;
  isClosed?: boolean;
};
