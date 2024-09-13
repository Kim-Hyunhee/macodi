import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { PrismaModule } from './module/prisma/prisma.module';
import { CompanyModule } from './module/company/company.module';
import { AdminModule } from './module/admin/admin.module';
import { ProjectModule } from './module/project/project.module';
import { UploadModule } from './module/upload/upload.module';
import { JobModule } from './module/job/job.module';
import { SceneModule } from './module/scene/scene.module';
import { ProductModule } from './module/product/product.module';
import { PinModule } from './module/pin/pin.module';
import { InquiryModule } from './module/inquiry/inquiry.module';
import { StoreModule } from './module/store/store.module';
import { LocationModule } from './module/location/location.module';
import { PurposeModule } from './module/purpose/purpose.module';
import { CategoryModule } from './module/category/category.module';
import { PartnershipModule } from './module/partnership/partnership.module';
import { AligoModule } from './module/aligo/aligo.module';
import { ProductOptionModule } from './module/product-option/product-option.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    PrismaModule,
    CompanyModule,
    AdminModule,
    ProjectModule,
    UploadModule,
    JobModule,
    SceneModule,
    ProductModule,
    PinModule,
    InquiryModule,
    StoreModule,
    LocationModule,
    PurposeModule,
    CategoryModule,
    PartnershipModule,
    AligoModule,
    ProductOptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
