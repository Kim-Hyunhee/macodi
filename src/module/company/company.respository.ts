import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompanyRepository {
  constructor(private prisma: PrismaService) {}

  // 전문가(Company) 테이블에 정보 저장
  async insertCompany(data: InsertCompany) {
    return await this.prisma.company.create({ data });
  }

  // 전문가(Company) 테이블에서 조건이 맞는 첫 번째 줄
  async findCompany({
    id,
    userName,
    name,
    email,
    managerName,
  }: {
    id?: number;
    userName?: string;
    name?: string;
    email?: string;
    managerName?: string;
  }) {
    return await this.prisma.company.findFirst({
      where: { id, userName, name, email, managerName },
      include: {
        projects: true,
      },
    });
  }

  // 전문가(Company) 테이블에서 조건에 맞는 배열
  async findManyCompany({
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
        | { userName?: { contains: string } }
        | { name?: { contains: string } }
        | { contactNumber?: { contains: string } }
      )[];
    } = {};

    if (searchOption?.keyword) {
      const keyword = searchOption.keyword;

      whereCondition.OR = [
        { userName: { contains: keyword } },
        { name: { contains: keyword } },
        { contactNumber: { contains: keyword } },
      ];
    }

    const orderBy: { [key: string]: 'asc' | 'desc' }[] = [];
    if (filter.item && filter.range) {
      if (
        filter.item === 'userName' ||
        filter.item === 'email' ||
        filter.item === 'name' ||
        filter.item === 'status'
      ) {
        orderBy.unshift({ [filter.item]: filter.range as 'asc' | 'desc' });
      }
    }

    const companies = await this.prisma.company.findMany({
      skip: skipAmount,
      take: PAGE_SIZE,
      where: whereCondition,
      include: { projects: true },
      orderBy,
    });

    const companyTotal = await this.prisma.company.count();
    const pageTotal = await this.prisma.company.count({
      where: whereCondition,
    });
    const next = pageTotal - PAGE_SIZE * where.page < 0 ? null : where.page + 1;

    return { companies, companyTotal, pageTotal, next };
  }

  // 전문가(Company) 테이블에서 해당 id 정보 변경
  async updateCompany({
    where,
    data,
  }: {
    where: { id: number };
    data: UpdateCompany;
  }) {
    return await this.prisma.company.update({ where, data });
  }

  // 전문가(Company) 테이블에서 해당 id 삭제
  async deleteCompany(where: { id: number }) {
    return await this.prisma.company.delete({ where });
  }
}

export type InsertCompany = {
  userName: string;
  password: string;
  name: string;
  contactNumber: string;
  email: string;
  managerName: string;
  managerNumber: string;
  site?: string;
  license: string;
  address: string;
  job: string;
};

export type UpdateCompany = {
  userName?: string;
  password?: string;
  name?: string;
  contactNumber?: string;
  email?: string;
  managerName?: string;
  managerNumber?: string;
  site?: string;
  license?: string;
  address?: string;
  job?: string;
  status?: boolean;
  isClosed?: boolean;
};
