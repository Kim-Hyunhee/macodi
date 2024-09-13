import { Injectable } from '@nestjs/common';
import { JobRepository } from './job.repository';

@Injectable()
export class JobService {
  constructor(private respository: JobRepository) {}

  // 업종 목록
  async fetchManyJob() {
    return await this.respository.findManyJob();
  }
}
