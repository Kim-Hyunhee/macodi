import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ProjectRepository } from './project.repository';

@Injectable()
export class ProjectService {
  constructor(private repository: ProjectRepository) {}

  async createProject({
    companyId,
    userId,
    name,
  }: {
    companyId?: number;
    userId?: number;
    name: string;
  }) {
    return await this.repository.insertProject({
      userId,
      companyId,
      name,
    });
  }

  async fetchProject({
    projectId,
    userId,
    companyId,
  }: {
    projectId: number;
    userId?: number;
    companyId?: number;
  }) {
    const project = await this.repository.findProject({ id: projectId });

    if (!project) {
      throw new BadRequestException('Project does not exist...');
    }
    if (userId) {
      if (project.userId !== userId) {
        throw new ForbiddenException('Forbidden error...');
      }
    } else if (companyId) {
      if (project.companyId !== companyId) {
        throw new ForbiddenException('Forbidden error...');
      }
    }

    return project;
  }

  async fetchManyProject({
    userId,
    companyId,
  }: {
    userId?: number;
    companyId?: number;
  }) {
    return await this.repository.findManyProject({ userId, companyId });
  }

  async modifyProject({
    userId,
    companyId,
    projectId,
    name,
  }: {
    userId?: number;
    companyId?: number;
    projectId: number;
    name: string;
  }) {
    await this.fetchProject({ userId, companyId, projectId });

    return await this.repository.updateProject({
      where: { id: projectId },
      data: { name },
    });
  }

  async removeProject({
    userId,
    companyId,
    projectId,
  }: {
    userId?: number;
    companyId?: number;
    projectId: number;
  }) {
    await this.fetchProject({ projectId, userId, companyId });

    return await this.repository.deleteProject({ id: projectId });
  }
}
