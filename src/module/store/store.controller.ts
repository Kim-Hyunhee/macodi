import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UseGuards,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Get,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  PostStoreLoginBody,
  PostSignUpStoreBody,
  PatchStatusBody,
  GetStoreQuery,
  PutStoreBody,
  PostCheckOverlapEmail,
  PostStoreForgotId,
  PostStoreForgotPassword,
  PutStoreMeBody,
  PatchStorePasswordBody,
} from './type';
import { StoreService } from './store.service';
import { AuthService } from '../auth/auth.service';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRoleAndId } from 'src/decorators/userRoleAndId.decorator';

@ApiTags('store')
@ApiBearerAuth('access-token')
@Controller('store')
export class StoreController {
  constructor(
    private storeService: StoreService,
    private authService: AuthService,
  ) {}

  @Post('/signUp')
  async postSignUpStore(@Body() body: PostSignUpStoreBody) {
    return await this.storeService.createStore(body);
  }

  @Post('/logIn') async postLoginStore(
    @Body() { userName, password }: PostStoreLoginBody,
  ) {
    const store = await this.storeService.fetchStore({ userName });
    if (!store) {
      throw new BadRequestException('ID 오류입니다. 다시 시도해주세요.');
    }

    await this.authService.checkStorePassword({ store, password });

    const token = await this.authService.generateToken({ storeId: store.id });

    return { token };
  }

  @Post('/checkEmail')
  async postEmailOverlab(@Body() { userName }: PostCheckOverlapEmail) {
    const store = await this.storeService.fetchStore({ userName });
    if (store) {
      throw new BadRequestException('Overlap your email');
    }

    return true;
  }

  @Post('/forgotId')
  async postForgotId(@Body() { companyName, email }: PostStoreForgotId) {
    const store = await this.storeService.fetchStore({
      companyName,
      email,
    });
    if (!store) {
      throw new BadRequestException('공급자 정보가 없습니다.');
    }

    return { userName: store.userName };
  }

  @Post('/forgotPassword')
  async postForgotPassword(
    @Body() { companyName, email, userName }: PostStoreForgotPassword,
  ) {
    return await this.storeService.fetchPasswordURL({
      companyName,
      email,
      userName,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getStore(@UserRoleAndId() userRoleAndId: { role: string; id: number }) {
    const { id, role } = userRoleAndId;

    if (role !== 'store') {
      throw new BadRequestException(`Only user can check it yourself.`);
    }

    return await this.storeService.fetchStoreById({ storeId: id });
  }

  @UseGuards(JwtAuthGuard)
  @Put('/me')
  async putMe(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Body() body: PutStoreMeBody,
  ) {
    const { id, role } = userRoleAndId;
    if (role !== 'store') {
      throw new BadRequestException(`Only user can check it yourself.`);
    }

    await this.storeService.modifyStore({ data: body, storeId: id });

    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/password')
  async patchStorePassword(
    @Body() body: PatchStorePasswordBody,
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
  ) {
    const { id, role } = userRoleAndId;
    if (role !== 'store') {
      throw new BadRequestException(`Only user can check it yourself.`);
    }

    await this.storeService.modifyStore({ storeId: id, data: body });

    return true;
  }

  @UseGuards(AdminGuard)
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteStore(@Param('id', ParseIntPipe) storeId: number) {
    await this.storeService.removeStore({ storeId });

    return true;
  }

  @UseGuards(AdminGuard)
  @UseGuards(JwtAuthGuard)
  @Patch('/:id/status')
  async patchStoreStatus(
    @Body() { status }: PatchStatusBody,
    @Param('id', ParseIntPipe) storeId: number,
  ) {
    await this.storeService.modifyStoreStatus({ status, storeId });

    return true;
  }

  @UseGuards(AdminGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getManyStore(@Query() { page, keyword, item, range }: GetStoreQuery) {
    return await this.storeService.fetchManyStore({
      page,
      keyword,
      item,
      range,
    });
  }

  @UseGuards(AdminGuard)
  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async putStore(
    @Body() body: PutStoreBody,
    @Param('id', ParseIntPipe) storeId: number,
  ) {
    await this.storeService.modifyStore({ data: body, storeId });

    return true;
  }

  @UseGuards(AdminGuard)
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getStoreInfo(@Param('id', ParseIntPipe) storeId: number) {
    return await this.storeService.fetchStoreById({ storeId });
  }
}
