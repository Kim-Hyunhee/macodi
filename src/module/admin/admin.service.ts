import { BadRequestException, Injectable } from '@nestjs/common';
import { AdminRepository } from './admin.repository';
import { ProjectService } from '../project/project.service';

@Injectable()
export class AdminService {
  constructor(
    private repository: AdminRepository,
    private projectService: ProjectService,
  ) {}

  // 관리자 정보 상세보기
  async fetchAdmin({ id, userName }: { id?: number; userName?: string }) {
    const admin = await this.repository.findAdmin({ id, userName });
    if (!admin) {
      throw new BadRequestException('There is no that admin');
    }

    return admin;
  }

  // 프로젝트 목록
  async fetchManyProject({
    userId,
    companyId,
  }: {
    userId?: number;
    companyId?: number;
  }) {
    return await this.projectService.fetchManyProject({ userId, companyId });
  }
}
