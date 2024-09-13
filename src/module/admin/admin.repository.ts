import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminRepository {
  constructor(private prisma: PrismaService) {}

  // 관리자(Admin) 테이블에서 조건이 맞는 첫 번째 줄
  async findAdmin({ id, userName }: { id?: number; userName?: string }) {
    return await this.prisma.admin.findUnique({ where: { id, userName } });
  }
}
