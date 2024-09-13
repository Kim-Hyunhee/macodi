import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { StoreModule } from '../store/store.module';

@Module({
  providers: [UploadService],
  controllers: [UploadController],
  imports: [MulterModule, StoreModule],
  exports: [UploadService],
})
export class UploadModule {}
