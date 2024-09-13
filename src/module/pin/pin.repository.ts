import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PinRepository {
  constructor(private prisma: PrismaService) {}

  // 샘플(Pin) 테이블에 데이터 생성
  async insertPin(data: insertPin) {
    return await this.prisma.pin.create({ data });
  }

  // 샘플(Pin) 테이블에서 조건에 맞는 첫 번째 줄
  async findPin(where: {
    id?: number;
    sceneId?: number;
    productOptionId?: number;
  }) {
    return await this.prisma.pin.findFirst({
      where,
      include: {
        scene: { include: { project: true } },
        productOption: {
          include: {
            product: {
              include: { category: true, location: true, store: true },
            },
          },
        },
      },
    });
  }

  // 특정 샘플(Pin) id 삭제
  async deleteManyPin(where: { ids: number[] }) {
    return await this.prisma.pin.deleteMany({
      where: { id: { in: where.ids } },
    });
  }

  // 샘플(Pin) 테이블의 모든 배열
  async findManyPin() {
    return await this.prisma.pin.findMany({
      include: {
        scene: { include: { project: true } },
        productOption: { include: { product: true } },
      },
    });
  }
}

export type insertPin = {
  sceneId: number;
  xCoordinate: string;
  yCoordinate: string;
  productOptionId: number;
};
