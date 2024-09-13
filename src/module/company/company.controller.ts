import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UseGuards,
  Get,
  ParseIntPipe,
  Param,
  Patch,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  GetCompanyQuery,
  PostCompanyLoginBody,
  PatchStatusBody,
  PostCheckOverlapEmail,
  PostForgotIdBody,
  PostSignUpCompanyBody,
  PutCompanyBody,
  postCompanyForgotPasswordBody,
  patchCompanyPasswordBody,
  PatchCompanyIsClosedBody,
} from './type';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRoleAndId } from 'src/decorators/userRoleAndId.decorator';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('company')
@Controller('company')
@ApiBearerAuth('access-token')
export class CompanyController {
  constructor(
    private companyService: CompanyService,
    private authService: AuthService,
  ) {}

  // 이메일 중복 확인
  @Post('/checkEmail')
  async postEmailOverlab(@Body() { userName }: PostCheckOverlapEmail) {
    const company = await this.companyService.fetchCompanyByUserName({
      userName,
    });
    // 같은 아이디(회원 가입 시 적는 이메일 주소)가 있을 경우 에러 처리
    if (company) {
      throw new BadRequestException('Overlap your email');
    }

    return true;
  }

  // 회원가입
  @Post('/signUp')
  async postSignUp(@Body() body: PostSignUpCompanyBody) {
    const company = await this.companyService.createCompany(body);

    return { userId: company.id, type: 'company' };
  }

  // 로그인
  @Post('/logIn')
  async postLogin(@Body() { userName, password }: PostCompanyLoginBody) {
    const company = await this.companyService.fetchCompanyByUserName({
      userName,
    });
    // DB에 company 정보가 없을 경우 에러 처리
    if (!company) {
      throw new BadRequestException('ID 오류입니다. 다시 시도해주세요.');
    }

    await this.authService.checkCompanyPassword({ company, password });

    // 활성 상태(status)가 false 일 경우 에러 처리
    if (!company.status) {
      throw new BadRequestException('승인 문자를 받으시고 로그인 해주세요.');
    }

    const token = await this.authService.generateToken({
      companyId: company.id,
    });

    return { token };
  }

  // 아이디 찾기
  @Post('/forgotId')
  async postForgotId(@Body() { managerName, email }: PostForgotIdBody) {
    const userName = await this.companyService.fetchUserName({
      managerName,
      email,
    });

    return { userName };
  }

  // 비밀번호 찾기
  @Post('/forgotPassword')
  async postForgotPassword(
    @Body() { managerName, email, userName }: postCompanyForgotPasswordBody,
  ) {
    return await this.companyService.fetchPasswordURL({
      managerName,
      email,
      userName,
    });
  }

  // 전문가 회원 본인 정보
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getMe(@UserRoleAndId() userRoleAndId: { role: string; id: number }) {
    const { id, role } = userRoleAndId;
    if (role !== 'company') {
      throw new BadRequestException(`Only company can check it yourself.`);
    }

    const company = await this.companyService.fetchCompanyById({
      companyId: id,
    });

    return { ...company, type: role };
  }

  // 본인 정보 수정
  @UseGuards(JwtAuthGuard)
  @Put('/me')
  async putMe(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Body() body: PutCompanyBody,
  ) {
    const { id, role } = userRoleAndId;
    if (role !== 'company') {
      throw new BadRequestException(`Only company can check it yourself.`);
    }

    return await this.companyService.modifyCompany({
      companyId: id,
      data: body,
    });
  }

  // 탈퇴
  @UseGuards(JwtAuthGuard)
  @Delete('/me')
  async deleteMe(@UserRoleAndId() userRoleAndId: { role: string; id: number }) {
    const { id, role } = userRoleAndId;
    if (role !== 'company') {
      throw new BadRequestException(`Only company can check it yourself.`);
    }
    await this.companyService.removeCompany({ companyId: id });

    return true;
  }

  // 비밀번호 변경
  @UseGuards(JwtAuthGuard)
  @Patch('/password')
  async patchUserPassword(
    @Body() { password }: patchCompanyPasswordBody,
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
  ) {
    const { id, role } = userRoleAndId;
    if (role !== 'company') {
      throw new BadRequestException(`Only company can check it yourself.`);
    }

    await this.companyService.modifyCompanyPassword({
      companyId: id,
      password,
    });

    return true;
  }

  // 튜토리얼 영상 다시 보지 않기 확인
  @UseGuards(JwtAuthGuard)
  @Patch('/isClosed')
  async patchCompanyIsClosed(
    @Body() { isClosed }: PatchCompanyIsClosedBody,
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
  ) {
    const { id, role } = userRoleAndId;
    if (role !== 'company') {
      throw new BadRequestException(`Only company can check it yourself.`);
    }

    await this.companyService.modifyCompanyIsClosed({
      companyId: id,
      isClosed,
    });

    return true;
  }

  //  관리자: 전문가 회원 정보 수정
  @UseGuards(AdminGuard)
  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async putCompany(
    @Body() body: PutCompanyBody,
    @Param('id', ParseIntPipe) companyId: number,
  ) {
    await this.companyService.modifyCompany({ data: body, companyId });

    return true;
  }

  // 전문가 회원 상태(status) 변경
  @UseGuards(AdminGuard)
  @UseGuards(JwtAuthGuard)
  @Patch('/:id/status')
  async patchCompanyStatus(
    @Body() { status }: PatchStatusBody,
    @Param('id', ParseIntPipe) companyId: number,
  ) {
    await this.companyService.modifyCompanyStatus({ status, companyId });

    return true;
  }

  // 관리자: 전문가 회원 탈퇴
  @UseGuards(AdminGuard)
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteCompany(@Param('id', ParseIntPipe) companyId: number) {
    await this.companyService.removeCompany({ companyId });

    return true;
  }

  // 전문가 회원 정보 목록
  @UseGuards(AdminGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getManyCompany(
    @Query() { page, keyword, item, range }: GetCompanyQuery,
  ) {
    return await this.companyService.fetchManyCompany({
      page,
      keyword,
      item,
      range,
    });
  }
}
