import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocationRepository {
  constructor(private prisma: PrismaService) {}

  // 사용 위치(Location)테이블에서 모든 배열
  async findManyLocation() {
    return await this.prisma.location.findMany();
  }

  // 사용 위치(Location) 테이블에서 조건이 맞는 첫 번째 줄
  async findLocation(where: { id?: number; name?: string }) {
    return await this.prisma.location.findFirst({ where });
  }
}
