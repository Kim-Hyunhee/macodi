import { Controller, Get } from '@nestjs/common';
import { JobService } from './job.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('job')
@ApiBearerAuth('access-token')
@Controller('job')
export class JobController {
  constructor(private jobService: JobService) {}

  // 업종 목록
  @Get()
  async getManyJob() {
    return await this.jobService.fetchManyJob();
  }
}
