import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JobRepository {
  constructor(private prisma: PrismaService) {}

  // 업종(Job) 테이블에서 모든 배열
  async findManyJob() {
    return await this.prisma.job.findMany();
  }
}
