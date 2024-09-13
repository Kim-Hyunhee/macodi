import { Module, forwardRef } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { InquiryController } from './inquiry.controller';
import { InquiryRepository } from './inquiry.repository';
import { PinModule } from '../pin/pin.module';
import { ProjectModule } from '../project/project.module';
import { ProductModule } from '../product/product.module';
import { CompanyModule } from '../company/company.module';
import { AligoModule } from '../aligo/aligo.module';

@Module({
  providers: [InquiryService, InquiryRepository],
  controllers: [InquiryController],
  imports: [
    PinModule,
    forwardRef(() => ProjectModule),
    ProductModule,
    CompanyModule,
    AligoModule,
  ],
})
export class InquiryModule {}
