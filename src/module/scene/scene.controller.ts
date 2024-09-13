import {
  Body,
  Controller,
  Post,
  UseGuards,
  ParseIntPipe,
  Get,
  Param,
  Put,
  Delete,
  Patch,
} from '@nestjs/common';
import { SceneService } from './scene.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  PatchManyScenePositionBody,
  PostSceneBody,
  PutSceneBody,
} from './type';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRoleAndId } from 'src/decorators/userRoleAndId.decorator';

@ApiTags('scene')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('scene')
export class SceneController {
  constructor(private sceneService: SceneService) {}

  // 씬 등록
  @Post()
  async postScene(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Body() { title, projectId, image, position }: PostSceneBody,
  ) {
    const { role, id } = userRoleAndId;

    return await this.sceneService.createScene({
      title,
      projectId,
      [role + 'Id']: id,
      image,
      position,
    });
  }

  // 씬 상세보기
  @Get('/:id')
  async getScene(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Param('id', ParseIntPipe) sceneId: number,
  ) {
    const { role, id } = userRoleAndId;

    return await this.sceneService.fetchScene({ sceneId, [role + 'Id']: id });
  }

  // 씬 수정
  @Put('/:id')
  async putScene(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Param('id', ParseIntPipe) sceneId: number,
    @Body() { title, image }: PutSceneBody,
  ) {
    const { role, id } = userRoleAndId;

    await this.sceneService.modifyScene({
      sceneId,
      [role + 'Id']: id,
      title,
      image,
    });

    return true;
  }

  // 씬 삭제
  @Delete('/:id')
  async deleteScene(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Param('id', ParseIntPipe) sceneId: number,
  ) {
    const { role, id } = userRoleAndId;

    return await this.sceneService.removeScene({
      sceneId,
      [role + 'Id']: id,
    });
  }

  // 씬 위치 변경
  @Patch('/position')
  async patchManyScenePosition(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Body() { data, projectId }: PatchManyScenePositionBody,
  ) {
    const { role, id } = userRoleAndId;

    await this.sceneService.modifyScenePosition({
      [role + 'Id']: id,
      data,
      projectId,
    });

    return true;
  }
}
