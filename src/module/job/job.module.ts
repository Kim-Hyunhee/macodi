import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { JobRepository } from './job.repository';

@Module({
  providers: [JobService, JobRepository],
  controllers: [JobController],
})
export class JobModule {}
