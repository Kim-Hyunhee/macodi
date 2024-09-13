import { Controller, Get, UseGuards } from '@nestjs/common';
import { PurposeService } from './purpose.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('purpose')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('purpose')
export class PurposeController {
  constructor(private purposeService: PurposeService) {}

  // 용도 목록
  @Get()
  async getManyPurpose() {
    return await this.purposeService.fetchManyPurpose();
  }
}
