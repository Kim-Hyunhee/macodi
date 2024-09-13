import { Body, Controller, Post } from '@nestjs/common';
import { PartnershipService } from './partnership.service';
import { PostPartnershipBody } from './type';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('partnership')
@Controller('partnership')
export class PartnershipController {
  constructor(private partnershipService: PartnershipService) {}

  // 제휴 신청
  @Post()
  async postPartnership(@Body() body: PostPartnershipBody) {
    return await this.partnershipService.createPartnership(body);
  }
}
