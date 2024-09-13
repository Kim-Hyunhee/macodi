import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GetProjectQuery, PostProjectBody, PutProjectBody } from './type';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRoleAndId } from 'src/decorators/userRoleAndId.decorator';

@ApiTags('project')
@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  // 랜딩 페이지에서 보이는 프로젝트 목록
  @Get('/landing')
  async getManyProjectByLanding(@Query() { userId }: GetProjectQuery) {
    return await this.projectService.fetchManyProject({ userId });
  }

  // 프로젝트 생성
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post()
  async postProject(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Body() { name }: PostProjectBody,
  ) {
    const { role, id } = userRoleAndId;

    return await this.projectService.createProject({
      [role + 'Id']: id,
      name,
    });
  }

  // 사용자(개인, 전문가 회원)의 프로젝트 목록
  @UseGuards(JwtAuthGuard)
  @Get()
  async getManyProject(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
  ) {
    const { role, id } = userRoleAndId;

    return await this.projectService.fetchManyProject({
      [role + 'Id']: id,
    });
  }

  // 프로젝트 상세보기
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getProject(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Param('id', ParseIntPipe) projectId: number,
  ) {
    const { role, id } = userRoleAndId;

    return await this.projectService.fetchProject({
      [role + 'Id']: id,
      projectId,
    });
  }

  // 프로젝트 수정
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async putProject(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Param('id', ParseIntPipe) projectId: number,
    @Body() { name }: PutProjectBody,
  ) {
    const { role, id } = userRoleAndId;

    await this.projectService.modifyProject({
      [role + 'Id']: id,
      projectId,
      name,
    });

    return true;
  }

  // 프로젝트 삭제
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteProject(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Param('id', ParseIntPipe) projectId: number,
  ) {
    const { role, id } = userRoleAndId;

    await this.projectService.removeProject({
      [role + 'Id']: id,
      projectId,
    });

    return true;
  }
}
