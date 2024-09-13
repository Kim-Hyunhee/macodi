import { Injectable, BadRequestException } from '@nestjs/common';
import { LocationRepository } from './location.repository';

@Injectable()
export class LocationService {
  constructor(private repository: LocationRepository) {}

  // 사용 위치 목록
  async fetchManyLocation() {
    return await this.repository.findManyLocation();
  }

  // 특정 사용 위치 정보
  async fetchLocation({
    locationId,
    locationName,
  }: {
    locationId?: number;
    locationName?: string;
  }) {
    const location = await this.repository.findLocation({
      id: locationId,
      name: locationName,
    });

    if (!location) {
      throw new BadRequestException('Location does not exist...');
    }

    return location;
  }
}
