import {
  Controller,
  Body,
  Post,
  UseGuards,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  Get,
} from '@nestjs/common';
import { PinService as PinService } from './pin.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRoleAndId } from 'src/decorators/userRoleAndId.decorator';
import { DeletePinBody, PostExcelDownloadBody, PostPinBody } from './type';

@ApiTags('pin')
@ApiBearerAuth('access-token')
@Controller('pin')
export class PinController {
  constructor(private pinService: PinService) {}

  // 랜딩 페이지에서 특정 샘플 정보 확인
  @Get('/:id/landing')
  async getPinByLanding(@Param('id', ParseIntPipe) pinId: number) {
    return await this.pinService.fetchPinById({ pinId });
  }

  // 사용자(개인, 전문가 회원) 샘플 적용
  @UseGuards(JwtAuthGuard)
  @Post()
  async postPin(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Body() { sceneId, xCoordinate, yCoordinate, productOptionId }: PostPinBody,
  ) {
    const { role, id } = userRoleAndId;

    return await this.pinService.createPin({
      sceneId,
      xCoordinate,
      yCoordinate,
      productOptionId,
      [role + 'Id']: id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteManyPin(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Body() { ids }: DeletePinBody,
  ) {
    const { role, id } = userRoleAndId;

    await this.pinService.removeManyPin({
      pinIds: ids,
      [role + 'Id']: id,
    });

    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getPin(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Param('id', ParseIntPipe) pinId: number,
  ) {
    const { role, id } = userRoleAndId;

    return await this.pinService.fetchPinById({ pinId, [role + 'Id']: id });
  }

  @UseGuards(JwtAuthGuard)
  @Post('/excel/download')
  async getExcel(
    @Body() { ids }: PostExcelDownloadBody,
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
  ) {
    const { role, id } = userRoleAndId;

    return await this.pinService.downloadExcel({
      pinIds: ids,
      [role + 'Id']: id,
    });
  }
}
