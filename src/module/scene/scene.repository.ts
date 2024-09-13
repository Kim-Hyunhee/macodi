import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SceneRepository {
  constructor(private prisma: PrismaService) {}

  // 씬(Scene) 테이블에 데이터 생성
  async insertScene(data: {
    title: string;
    projectId: number;
    image: string;
    position: number;
  }) {
    return await this.prisma.scene.create({ data });
  }

  // 씬(Scene) 테이블에서 조건에 맞는 첫 번째 줄
  async findScene(where: { id: number }) {
    return await this.prisma.scene.findUnique({
      where,
      include: { project: true, pins: true },
    });
  }

  // 씬(Scene) 테이블에서 조건에 맞는 배열
  async findManyScene(where: { projectId: number }) {
    return await this.prisma.scene.findMany({
      where,
      include: { project: true },
    });
  }

  // 특정 씬(Scene) 데이터 수정
  async updateScene({
    where,
    data,
  }: {
    where: { id: number };
    data: { title?: string; image?: string; position?: number };
  }) {
    return await this.prisma.scene.update({ where, data });
  }

  // 특정 씬(Scene) 데이터 삭제
  async deleteScene(where: { id: number }) {
    return await this.prisma.scene.delete({ where });
  }
}
