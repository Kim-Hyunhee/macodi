import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UseGuards,
  Query,
  Get,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetProjectQuery, PostAdminLoginBodyDTO } from './type';
import { AuthService } from '../auth/auth.service';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private authService: AuthService,
  ) {}

  // 관리자 로그인
  @Post('/logIn')
  async postLogin(@Body() { userName, password }: PostAdminLoginBodyDTO) {
    const admin = await this.adminService.fetchAdmin({ userName });
    if (!admin) {
      throw new BadRequestException('ID 오류입니다. 다시 시도해주세요.');
    }

    await this.authService.checkAdminPassword({ admin, password });

    const token = await this.authService.generateToken({ adminId: admin.id });

    return { token };
  }

  // 사용자(개인, 전문가 회원) 프로젝트 목록
  @ApiBearerAuth('access-token')
  @UseGuards(AdminGuard)
  @UseGuards(JwtAuthGuard)
  @Get('/project')
  async getProject(@Query() { userId, companyId }: GetProjectQuery) {
    return await this.adminService.fetchManyProject({ userId, companyId });
  }
}
