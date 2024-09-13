import { Injectable, BadRequestException } from '@nestjs/common';
import { PurposeRepository } from './purpose.repository';

@Injectable()
export class PurposeService {
  constructor(private repository: PurposeRepository) {}

  // 용도 목록
  async fetchManyPurpose() {
    return await this.repository.findManyPurpose();
  }

  // 용도 상세보기
  async fetchPurpose({
    purposeId,
    purposeName,
  }: {
    purposeId?: number;
    purposeName?: string;
  }) {
    const purpose = await this.repository.findPurpose({
      id: purposeId,
      name: purposeName,
    });

    if (!purpose) {
      throw new BadRequestException('Purpose does not exist...');
    }

    return purpose;
  }
}
