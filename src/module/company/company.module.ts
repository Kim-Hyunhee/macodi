import { Module, forwardRef } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { CompanyRepository } from './company.respository';
import { AuthModule } from '../auth/auth.module';
import { AligoModule } from '../aligo/aligo.module';

@Module({
  providers: [CompanyService, CompanyRepository],
  controllers: [CompanyController],
  exports: [CompanyService],
  imports: [forwardRef(() => AuthModule), AligoModule],
})
export class CompanyModule {}
