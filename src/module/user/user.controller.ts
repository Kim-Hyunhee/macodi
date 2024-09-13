import {
  Body,
  Controller,
  Post,
  BadRequestException,
  Get,
  UseGuards,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  GetUserQuery,
  PostUserLoginBody,
  PostCheckOverlapEmail,
  PostForgotIdBody,
  PostSignUpUserBody,
  postUserForgotPasswordBody,
  PatchUserPasswordBody,
  PutUserBody,
  PatchUserIsClosedBody,
} from './type';
import { AuthService } from '../auth/auth.service';
import { UserRoleAndId } from 'src/decorators/userRoleAndId.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('user')
@Controller('user')
@ApiBearerAuth('access-token')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('/checkEmail')
  async postEmailOverlab(@Body() { userName }: PostCheckOverlapEmail) {
    const user = await this.userService.fetchUserByUserName({ userName });
    if (user) {
      throw new BadRequestException('Overlap your email');
    }

    return true;
  }

  @Post('/signUp')
  async postSignUpUser(@Body() body: PostSignUpUserBody) {
    const user = await this.userService.createUser(body);

    return { userId: user.id, type: 'user' };
  }

  @Post('/logIn')
  async postLogin(@Body() { userName, password }: PostUserLoginBody) {
    const user = await this.userService.fetchUserByUserName({ userName });
    if (!user) {
      throw new BadRequestException('ID 오류입니다. 다시 시도해주세요.');
    }

    await this.authService.checkUserPassword({ user, password });

    const token = await this.authService.generateToken({ userId: user.id });

    return { token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getMe(@UserRoleAndId() userRoleAndId: { role: string; id: number }) {
    const { id, role } = userRoleAndId;
    if (role !== 'user') {
      throw new BadRequestException(`Only user can check it yourself.`);
    }

    const user = await this.userService.fetchUserById({ userId: id });

    return { ...user, type: role };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/me')
  async putMe(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Body() body: PutUserBody,
  ) {
    const { id, role } = userRoleAndId;
    if (role !== 'user') {
      throw new BadRequestException(`Only user can check it yourself.`);
    }

    return await this.userService.modifyUser({ userId: id, data: body });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/me')
  async deleteMe(@UserRoleAndId() userRoleAndId: { role: string; id: number }) {
    const { id, role } = userRoleAndId;
    if (role !== 'user') {
      throw new BadRequestException(`Only user can check it yourself.`);
    }
    await this.userService.removeUser({ userId: id });

    return true;
  }

  @Post('/forgotId')
  async postForgotId(@Body() { name, email }: PostForgotIdBody) {
    const userName = await this.userService.fetchUserName({ name, email });

    return { userName };
  }

  @UseGuards(AdminGuard)
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteUser(@Param('id', ParseIntPipe) userId: number) {
    await this.userService.removeUser({ userId });

    return true;
  }

  @UseGuards(AdminGuard)
  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async putUser(
    @Body() body: PutUserBody,
    @Param('id', ParseIntPipe) userId: number,
  ) {
    await this.userService.modifyUser({ data: body, userId });

    return true;
  }

  @UseGuards(AdminGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getManyUser(@Query() { page, keyword, item, range }: GetUserQuery) {
    return await this.userService.fetchManyUser({ page, keyword, item, range });
  }

  @Post('/forgotPassword')
  async postForgotPassword(
    @Body() { name, email, userName }: postUserForgotPasswordBody,
  ) {
    return await this.userService.fetchPasswordURL({ name, email, userName });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/password')
  async patchUserPassword(
    @Body() { password }: PatchUserPasswordBody,
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
  ) {
    const { id, role } = userRoleAndId;
    if (role !== 'user') {
      throw new BadRequestException(`Only user can check it yourself.`);
    }

    await this.userService.modifyUserPassword({ userId: id, password });

    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/isClosed')
  async patchUserIsClosed(
    @Body() { isClosed }: PatchUserIsClosedBody,
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
  ) {
    const { id, role } = userRoleAndId;
    if (role !== 'user') {
      throw new BadRequestException(`Only user can check it yourself.`);
    }

    await this.userService.modifyUserIsClosed({ userId: id, isClosed });

    return true;
  }
}
