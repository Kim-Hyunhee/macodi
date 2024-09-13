import { Module, forwardRef } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { LocationModule } from '../location/location.module';
import { PurposeModule } from '../purpose/purpose.module';
import { CategoryModule } from '../category/category.module';
import { ProductOptionModule } from '../product-option/product-option.module';
import { StoreModule } from '../store/store.module';

@Module({
  providers: [ProductService, ProductRepository],
  controllers: [ProductController],
  exports: [ProductService],
  imports: [
    LocationModule,
    PurposeModule,
    CategoryModule,
    forwardRef(() => ProductOptionModule),
    forwardRef(() => StoreModule),
  ],
})
export class ProductModule {}
