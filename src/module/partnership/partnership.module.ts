import { Module } from '@nestjs/common';
import { PartnershipService } from './partnership.service';
import { PartnershipController } from './partnership.controller';
import { AligoModule } from '../aligo/aligo.module';

@Module({
  providers: [PartnershipService],
  controllers: [PartnershipController],
  imports: [AligoModule],
})
export class PartnershipModule {}
