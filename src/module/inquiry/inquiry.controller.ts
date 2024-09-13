import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRoleAndId } from 'src/decorators/userRoleAndId.decorator';
import {
  DeleteInquiryBody,
  GetInquiryQuery,
  GetManyInquiryPinQuery,
  PatchInquiryPinComplete,
  PostInquiryBody,
} from './type';

@ApiTags('inquiry')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('inquiry')
export class InquiryController {
  constructor(private inquiryService: InquiryService) {}

  // 샘플 문의 생성(전문가 회원만 가능)
  @Post()
  async postInquiry(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Body()
    { pinIdInfo, projectId, receiver, address, contactNumber }: PostInquiryBody,
  ) {
    const { role, id } = userRoleAndId;
    if (role !== 'company') {
      throw new BadRequestException(`Only company can check it yourself.`);
    }

    await this.inquiryService.createInquiry({
      companyId: id,
      pinIdInfo,
      projectId,
      receiver,
      address,
      contactNumber,
    });

    return true;
  }

  // 본인(전문가 회원)이 신청한 샘플 문의 목록
  @Get()
  async getManyInquiry(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Query() { projectId }: GetInquiryQuery,
  ) {
    const { role, id } = userRoleAndId;
    if (role !== 'company') {
      throw new BadRequestException(`Only company can check it yourself.`);
    }

    return await this.inquiryService.fetchManyInquiry({
      companyId: id,
      projectId,
    });
  }

  // 본인(전문가 회원)이 신청한 샘플 문의 삭제(여러 개 가능)
  @Delete()
  async deleteManyInquiry(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Body() { ids }: DeleteInquiryBody,
  ) {
    const { role, id } = userRoleAndId;
    if (role !== 'company') {
      throw new BadRequestException(`Only company can check it yourself.`);
    }

    await this.inquiryService.removeManyInquiry({
      companyId: id,
      inquiryIds: ids,
    });

    return true;
  }

  // 공급자가 받은 샘플 문의 목록(관리자도 확인 가능)
  @Get('/received')
  async getManyInquiryPin(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Query()
    { startDate, endDate, page, keyword, item, range }: GetManyInquiryPinQuery,
  ) {
    const { role, id } = userRoleAndId;

    return await this.inquiryService.fetchManyInquiryPin({
      [role + 'Id']: id,
      startDate,
      endDate,
      keyword,
      page,
      item,
      range,
    });
  }

  // 특정 샘플 문의의 제품 상담 완료
  @Patch('/:id/isCompleted')
  async patchInquiryPinComplete(
    @UserRoleAndId() userRoleAndId: { role: string; id: number },
    @Param('id', ParseIntPipe) inquiryPinId: number,
    @Body() { isCompleted }: PatchInquiryPinComplete,
  ) {
    // 공급자, 관리자만 가능
    const { role, id } = userRoleAndId;
    if (role !== 'store' && role !== 'admin') {
      throw new BadRequestException(`Only store/admin can check it yourself.`);
    }

    return await this.inquiryService.modifyInquiryPinComplete({
      inquiryPinId,
      isCompleted,
      [role + 'Id']: id,
    });
  }
}
