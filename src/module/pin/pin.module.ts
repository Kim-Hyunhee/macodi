import { Module } from '@nestjs/common';
import { PinService } from './pin.service';
import { PinController } from './pin.controller';
import { PinRepository } from './pin.repository';
import { SceneModule } from '../scene/scene.module';
import { ProductOptionModule } from '../product-option/product-option.module';
import { ProductModule } from '../product/product.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  providers: [PinService, PinRepository],
  controllers: [PinController],
  imports: [ProductOptionModule, SceneModule, ProductModule, UploadModule],
  exports: [PinService],
})
export class PinModule {}
