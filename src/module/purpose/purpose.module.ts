import { Module } from '@nestjs/common';
import { PurposeService } from './purpose.service';
import { PurposeController } from './purpose.controller';
import { PurposeRepository } from './purpose.repository';

@Module({
  providers: [PurposeService, PurposeRepository],
  controllers: [PurposeController],
  exports: [PurposeService],
})
export class PurposeModule {}
