import {
  Injectable,
  Inject,
  forwardRef,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import {
  ProductOptionRepository,
  UpdateProductOption,
} from './product-option.repository';
import { ProductService } from '../product/product.service';

@Injectable()
export class ProductOptionService {
  constructor(
    private repository: ProductOptionRepository,
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
  ) {}

  // 특정 상품 옵션 수정
  async modifyProductOption({
    productOptionId,
    data,
    storeId,
    adminId,
  }: {
    productOptionId: number;
    data: UpdateProductOption;
    storeId?: number;
    adminId?: number;
  }) {
    const productOption = await this.fetchProductOption({
      productOptionId,
      storeId,
    });

    await this.repository.updateProductOption({
      where: { id: productOptionId },
      data,
    });

    // 수정하는 상품 옵션에 참조되어 있는 상품을 가져와서 무조건 첫 번째 가격으로 수정
    const product = await this.productService.fetchProduct({
      productId: productOption.productId,
      storeId,
    });
    await this.productService.modifyProduct({
      data: { price: product.options[0].price },
      productId: product.id,
      storeId,
      adminId,
    });

    return true;
  }

  // 특정 상품 옵션 정보 가져오기
  async fetchProductOption({
    productOptionId,
    storeId,
    adminId,
  }: {
    productOptionId: number;
    storeId?: number;
    adminId?: number;
  }) {
    const productOption = await this.repository.findProductOption({
      id: productOptionId,
    });

    if (!productOption) {
      throw new BadRequestException('ProductOption does not exist...');
    }
    if (storeId) {
      if (productOption.product.storeId !== storeId) {
        throw new ForbiddenException('Forbidden error...');
      }
    }

    return productOption;
  }

  // 특정 상품 옵션 삭제
  async removeProductOption({
    productOptionId,
    storeId,
    adminId,
  }: {
    productOptionId: number;
    storeId?: number;
    adminId?: number;
  }) {
    const productOption = await this.fetchProductOption({
      productOptionId,
      storeId,
    });

    await this.repository.deleteProductOption({ id: productOptionId });

    const product = await this.productService.fetchProduct({
      productId: productOption.productId,
      storeId,
    });
    await this.productService.modifyProduct({
      data: { price: product.options[0].price },
      productId: product.id,
      storeId,
      adminId,
    });

    return true;
  }

  // 상품 옵션 여러 개 생성
  async createManyProductOption({
    productId,
    data,
  }: {
    productId: number;
    data: { size: string; price: number }[];
  }) {
    return await this.repository.insertManyProductOption({ productId, data });
  }

  // 상품 옵션 한 개 생성
  async createProductOption({
    productId,
    data,
  }: {
    productId: number;
    data: { size: string; price: number };
  }) {
    return await this.repository.insertProductOption({ productId, data });
  }
}
