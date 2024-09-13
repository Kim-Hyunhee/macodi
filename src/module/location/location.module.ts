import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { LocationRepository } from './location.repository';

@Module({
  providers: [LocationService, LocationRepository],
  controllers: [LocationController],
  exports: [LocationService],
})
export class LocationModule {}
