import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectRepository {
  constructor(private prisma: PrismaService) {}

  // 프로젝트(Project) 테이블에 데이터 생성
  async insertProject(data: {
    name: string;
    userId?: number;
    companyId?: number;
  }) {
    return await this.prisma.project.create({ data });
  }

  // 프로젝트(Project) 테이블에서 조건에 맞는 첫 번째 줄
  async findProject(where: { id: number }) {
    return await this.prisma.project.findUnique({
      where: { id: where.id },
      include: {
        scenes: {
          include: {
            pins: {
              include: {
                productOption: {
                  include: {
                    product: {
                      include: {
                        category: true,
                        location: true,
                        purpose: true,
                        store: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { position: 'asc' },
        },
      },
    });
  }

  // 프로젝트(Project) 테이블에 조건에 맞는 배열
  async findManyProject(where: { userId?: number; companyId?: number }) {
    return await this.prisma.project.findMany({
      where,
      include: {
        scenes: { include: { pins: true }, orderBy: { position: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 특정 프로젝트(Project) 데이터 수정
  async updateProject({
    where,
    data,
  }: {
    where: { id: number };
    data: { name: string };
  }) {
    return await this.prisma.project.update({ where, data });
  }

  // 특정 프로젝트(Project) 데이터 삭제
  async deleteProject(where: { id: number }) {
    return await this.prisma.project.delete({ where });
  }
}
