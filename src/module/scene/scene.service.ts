import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { SceneRepository } from './scene.repository';
import { ProjectService } from '../project/project.service';

@Injectable()
export class SceneService {
  constructor(
    private repository: SceneRepository,
    private projectService: ProjectService,
  ) {}

  // 씬 생성
  async createScene({
    companyId,
    userId,
    title,
    projectId,
    image,
    position,
  }: {
    companyId?: number;
    userId?: number;
    title: string;
    projectId: number;
    image: string;
    position: number;
  }) {
    // 본인이 생성한 project 내의 scene이 맞는 지 확인
    await this.projectService.fetchProject({ projectId, userId, companyId });

    return await this.repository.insertScene({
      title,
      projectId,
      image,
      position,
    });
  }

  // 조건에 맞는 씬 찾기
  async fetchScene({
    userId,
    companyId,
    sceneId,
  }: {
    userId?: number;
    companyId?: number;
    sceneId: number;
  }) {
    const scene = await this.repository.findScene({ id: sceneId });

    // 해당 씬이 없을 경우 에러 처리
    if (!scene) {
      throw new BadRequestException('Scene does not exist...');
    }

    // 사용자 본인(개인, 전문가) 씬이 아닐 경우 에러 처리
    if (userId) {
      if (scene.project.userId !== userId) {
        throw new ForbiddenException('Forbidden error...');
      }
    } else {
      if (scene.project.companyId !== companyId) {
        throw new ForbiddenException('Forbidden error...');
      }
    }

    return scene;
  }

  // 조건에 맞는 씬 배열 찾기
  async fetchManyScene({
    userId,
    companyId,
    projectId,
  }: {
    userId?: number;
    companyId?: number;
    projectId: number;
  }) {
    const sceneList = await this.repository.findManyScene({ projectId });

    // 사용자 본인(개인, 전문가)의 씬 배열만 return
    if (userId) {
      return sceneList.filter((scene) => scene.project.userId === userId);
    } else {
      return sceneList.filter((scene) => scene.project.companyId === companyId);
    }
  }

  // 특정 씬 수정
  async modifyScene({
    companyId,
    userId,
    sceneId,
    title,
    image,
  }: {
    companyId?: number;
    userId?: number;
    sceneId: number;
    title: string;
    image: string;
  }) {
    await this.fetchScene({ userId, companyId, sceneId });

    return await this.repository.updateScene({
      where: { id: sceneId },
      data: { title, image },
    });
  }

  // 특정 씬 삭제
  async removeScene({
    companyId,
    userId,
    sceneId,
  }: {
    companyId?: number;
    userId?: number;
    sceneId: number;
  }) {
    const scene = await this.fetchScene({ userId, companyId, sceneId });

    await this.repository.deleteScene({ id: sceneId });

    // 씬 삭제 후 프로젝트 정보 return
    return await this.projectService.fetchProject({
      projectId: scene.projectId,
      userId,
      companyId,
    });
  }

  // 씬 위치 수정(드래그 & 드랍)
  async modifyScenePosition({
    companyId,
    userId,
    data,
    projectId,
  }: {
    companyId?: number;
    userId?: number;
    data: { sceneId: number; position: number }[];
    projectId: number;
  }) {
    const project = await this.projectService.fetchProject({
      projectId,
      userId,
      companyId,
    });

    // data 배열에 같은 프로젝트 내의 씬이 아닐 경우 에러 처리
    const differ = data.filter(
      (d) =>
        project.scenes.filter((scene) => scene.id === d.sceneId).length > 0,
    );
    if (differ.length < data.length) {
      throw new BadRequestException(
        'Only Scenes within the same project can be modified.',
      );
    }

    await Promise.all(
      data.map(async (d) => {
        return await this.fetchScene({ userId, companyId, sceneId: d.sceneId });
      }),
    );

    // data 배열에 온 씬들 한 번에 위치 업데이트
    await Promise.all(
      data.map(async (d) => {
        return await this.repository.updateScene({
          where: { id: d.sceneId },
          data: { position: d.position },
        });
      }),
    );
  }
}
