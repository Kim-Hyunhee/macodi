import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PurposeRepository {
  constructor(private prisma: PrismaService) {}

  // 용도(Purpose) 테이블에서 모든 배열
  async findManyPurpose() {
    return await this.prisma.purpose.findMany();
  }

  // 용도(Purpose) 테이블에서 조건에 맞는 첫 번째 줄
  async findPurpose(where: { id?: number; name?: string }) {
    return await this.prisma.purpose.findFirst({ where });
  }
}
