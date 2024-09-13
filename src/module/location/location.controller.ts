import { Controller, Get, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('location')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('location')
export class LocationController {
  constructor(private locationService: LocationService) {}

  // 사용 위치 목록
  @Get()
  async getManyLocation() {
    return await this.locationService.fetchManyLocation();
  }
}
