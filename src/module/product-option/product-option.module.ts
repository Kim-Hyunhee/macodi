import { Module, forwardRef } from '@nestjs/common';
import { ProductOptionService } from './product-option.service';
import { ProductOptionController } from './product-option.controller';
import { ProductOptionRepository } from './product-option.repository';
import { ProductModule } from '../product/product.module';

@Module({
  providers: [ProductOptionService, ProductOptionRepository],
  controllers: [ProductOptionController],
  exports: [ProductOptionService],
  imports: [forwardRef(() => ProductModule)],
})
export class ProductOptionModule {}
