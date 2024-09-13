import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ProductRepository, UpdateProduct } from './product.repository';
import { CategoryService } from '../category/category.service';
import { LocationService } from '../location/location.service';
import { PurposeService } from '../purpose/purpose.service';
import { checkProductCode } from 'src/helper/randomCode';
import * as XLSX from 'xlsx-js-style';
import { ProductOptionService } from '../product-option/product-option.service';
import { getSimilarProduct } from 'src/helper/ai.module';

@Injectable()
export class ProductService {
  constructor(
    private repository: ProductRepository,
    private categoryService: CategoryService,
    private locationService: LocationService,
    private purposeService: PurposeService,
    private productOptionService: ProductOptionService,
  ) {}

  // 조건에 맞는 제품 목록
  async fetchManyProduct({
    storeId,
    page,
    file,
    userId,
    categoryIds,
    origin,
    locationId,
    purposeId,
    minPrice,
    maxPrice,
    keyword,
    range,
    item,
    companyId,
  }: {
    storeId?: number;
    page?: number;
    file?: string;
    userId?: number;
    companyId?: number;
    categoryIds?: number[];
    origin?: string;
    locationId?: number;
    purposeId?: number;
    minPrice?: number;
    maxPrice?: number;
    keyword?: string;
    range?: string;
    item?: string;
  }) {
    let productIds = [];
    let productScores = [];
    const k =
      keyword ||
      categoryIds ||
      origin ||
      locationId ||
      purposeId ||
      minPrice ||
      maxPrice
        ? 1000000
        : 100;
    const rgb_ratio = 3;

    if (file === 'data:,') {
      throw new BadRequestException('이미지 영역을 다시 설정해주세요.');
    }

    // AI 모듈로 file(크롭 이미지) 있을 경우에만 비슷한 이미지 return
    if (file) {
      const data = await getSimilarProduct({
        file,
        k,
        rgb_ratio,
      });

      productIds = data.ids as number[];
      productScores = data.scores as number[];
    }

    // 전체는 무조건 포함 되게
    const locationIds = [];
    if (locationId) {
      const allLocation = await this.locationService.fetchLocation({
        locationName: '전체',
      });
      locationIds.push(locationId, allLocation.id);
    }

    const purposeIds = [];
    if (purposeId) {
      const allPurpose = await this.purposeService.fetchPurpose({
        purposeName: '전체',
      });
      purposeIds.push(purposeId, allPurpose.id);
    }

    return await this.repository.findManyProduct({
      where: { page },
      productIds: productIds,
      scores: productScores,
      searchOption: {
        categoryIds,
        origin,
        locationIds,
        purposeIds,
        minPrice,
        maxPrice,
        keyword,
      },
      filter: { range, item },
      storeId,
      userId,
      companyId,
    });
  }

  // 특정 제품 상세보기
  async fetchProduct({
    productId,
    storeId,
    userId,
  }: {
    productId: number;
    storeId?: number;
    userId?: number;
  }) {
    const product = await this.repository.findProduct({ id: productId });

    if (!product) {
      throw new BadRequestException('Product does not exist...');
    }
    // 공급자인 경우 본인이 등록한 상품만 볼 수 있게
    if (storeId) {
      if (product.storeId !== storeId) {
        throw new ForbiddenException('Forbidden error...');
      }
    }
    // 개인 회원에게는 금액 안 보이게
    if (userId) {
      for (const option of product.options) {
        option.price = 0;
      }
    }
    return product;
  }

  // 제품 등록
  async createProduct({
    data,
    storeId,
    adminId,
  }: {
    data: {
      categoryId: number;
      subCategory: string;
      name: string;
      image: string;
      manufacturer: string;
      origin: string;
      country: string;
      isShowPrice: boolean;
      isShow: boolean;
      glossiness: string;
      locationId?: number;
      purposeId?: number;
      status: boolean;
      feature?: string;
      url?: string;
      options?: { size: string; price: number }[];
    };
    storeId: number;
    adminId?: number;
  }) {
    const { options, ...other } = data;
    if (!adminId && !storeId) {
      throw new ForbiddenException(
        'You are not authorized to access this api.',
      );
    }
    const products = await this.repository.findOnlyManyProduct();

    const code = await checkProductCode({ products });

    if (data.origin !== '국내산' && data.origin !== '수입산') {
      throw new BadRequestException('Checked origin name');
    }

    await this.categoryService.fetchCategoryById({
      categoryId: data.categoryId,
    });

    if (data.locationId) {
      await this.locationService.fetchLocation({ locationId: data.locationId });
    }
    if (data.purposeId) {
      await this.purposeService.fetchPurpose({ purposeId: data.purposeId });
    }

    const product = await this.repository.insertProduct({
      ...other,
      storeId,
      code,
      price: data.options[0].price,
    });

    // data에 option이 있는 경우 제품 옵션 같이 생성
    if (data.options) {
      return await this.productOptionService.createManyProductOption({
        productId: product.id,
        data: options,
      });
    }

    return product;
  }

  // 특정 제품 수정
  async modifyProduct({
    data,
    productId,
    storeId,
    adminId,
  }: {
    data: UpdateProduct;
    productId: number;
    storeId?: number;
    adminId?: number;
  }) {
    if (!adminId && !storeId) {
      throw new ForbiddenException(
        'You are not authorized to access this api.',
      );
    }

    if (data.origin && data.origin !== '국내산' && data.origin !== '수입산') {
      throw new BadRequestException('Checked origin name');
    }

    await this.fetchProduct({ productId, storeId });

    await this.categoryService.fetchCategoryById({
      categoryId: data.categoryId,
    });

    if (data.locationId) {
      await this.locationService.fetchLocation({ locationId: data.locationId });
    }
    if (data.purposeId) {
      await this.purposeService.fetchPurpose({ purposeId: data.purposeId });
    }

    return await this.repository.updateProduct({
      where: { id: productId },
      data,
    });
  }

  // 특정 제품 삭제
  async removeProduct({
    productIds,
    storeId,
    adminId,
  }: {
    productIds: number[];
    storeId?: number;
    adminId?: number;
  }) {
    if (!adminId && !storeId) {
      throw new ForbiddenException(
        'You are not authorized to access this api.',
      );
    }

    await Promise.all(
      productIds.map(async (productId) => {
        return await this.fetchProduct({ productId, storeId });
      }),
    );

    return await this.repository.deleteProduct({ ids: productIds });
  }

  // 특정 제품 상태값 변경
  async modifyProductStatus({
    productId,
    status,
    storeId,
    adminId,
  }: {
    productId: number;
    status: boolean;
    storeId?: number;
    adminId?: number;
  }) {
    if (!adminId && !storeId) {
      throw new ForbiddenException(
        'You are not authorized to access this api.',
      );
    }

    await this.fetchProduct({ productId, storeId });

    return await this.repository.updateProduct({
      where: { id: productId },
      data: { status },
    });
  }

  // 엑셀 파일 읽어서 DB에 저장
  async convertCreateFileToJSON({
    file,
    storeId,
  }: {
    file: Express.Multer.File;
    storeId: number;
  }) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 14 });

    const productMap = new Map();

    for (const row of rows) {
      if (!row[1] || !row[2] || !row[3]) {
        continue;
      }

      const category = row[2];
      const subCategory = row[3];
      const name = row[4];

      // 상품 식별자 생성 (예: "구분_종류_상품명")
      const productIdentifier = `${category}_${subCategory}_${name}`;

      // Map에 상품 추가 또는 업데이트
      if (!productMap.has(productIdentifier)) {
        productMap.set(productIdentifier, []);
      }
      productMap.get(productIdentifier).push(row);
    }

    const productInfoArray = [];

    for (const [productIdentifier, productRows] of productMap.entries()) {
      try {
        const locationName = productRows[0][13];
        const purposeName = productRows[0][14];

        const locationId = (
          await this.locationService.fetchLocation({ locationName })
        ).id;

        const purposeId = (
          await this.purposeService.fetchPurpose({ purposeName })
        ).id;

        let categoryId;
        const category = await this.categoryService.fetchCategoryByName({
          categoryName: productRows[0][1],
        });
        if (!category) {
          const createCategory = await this.categoryService.createCategory({
            name: productRows[0][1],
          });
          categoryId = createCategory.id;
        }

        categoryId = category ? category.id : categoryId;

        const imageName = ('' + productRows[0][3])
          .replace(/[^\w\s.가-힣]/g, '')
          .replaceAll(' ', '');

        const productInfo = {
          categoryId,
          subCategory: ('' + productRows[0][2]) as string,
          name: ('' + productRows[0][3]) as string,
          image: `https://backend-snl.s3.amazonaws.com/${storeId}/${imageName}.jpg`,
          manufacturer: productRows[0][6] as string,
          origin: productRows[0][8] as string,
          country: productRows[0][9] as string,
          glossiness: productRows[0][12],
          feature: (productRows[0][18] as string) || '',
          price: 0,
          isShowPrice: true,
          isShow: true,
          status: true,
          options: [] as { size: string; price: number }[],
          storeId,
          locationId,
          purposeId,
          url: productRows[0][5] as string,
        };

        productRows.forEach((row) => {
          try {
            if (row[10] !== '별도문의') {
              productInfo.options.push({
                size: ('' + row[11]) as string,
                price: Math.floor(row[10]),
              });
            } else {
              productInfo.options.push({
                size: ('' + row[11]) as string,
                price: 0,
              });
            }

            productInfo.price = row[10] as number;
            if (row[10] === '별도문의') {
              productInfo.isShowPrice = false;
              productInfo.price = 0;
            }
          } catch (error) {
            console.error(
              `Error processing options for product ${productInfo.name}:`,
              error,
            );
          }
        });

        productInfoArray.push(productInfo);
      } catch (error) {
        throw new BadRequestException(
          `Error processing product ${productRows[0][3]} (${productIdentifier}): ${error}`,
        );
      }
    }
    return productInfoArray;
  }

  // 특정 제품의 옵션 등록
  async createProductOption({
    productId,
    size,
    price,
    storeId,
    adminId,
  }: {
    productId: number;
    size: string;
    price: number;
    storeId?: number;
    adminId?: number;
  }) {
    if (!adminId && !storeId) {
      throw new ForbiddenException(
        'You are not authorized to access this api.',
      );
    }

    await this.fetchProduct({ productId, storeId });

    return await this.productOptionService.createProductOption({
      productId,
      data: { size, price },
    });
  }

  // 제품이 프로젝트에 등록 될 때 + 1
  async modifyProductApplyProject({ productId }: { productId: number }) {
    const product = await this.fetchProduct({ productId });

    return await this.repository.updateProduct({
      where: { id: productId },
      data: { applyProject: product.applyProject + 1 },
    });
  }

  // 샘플 문의 했을 때 + 1
  async modifyProductSampleInquiry({ productId }: { productId: number }) {
    const product = await this.fetchProduct({ productId });

    return await this.repository.updateProduct({
      where: { id: productId },
      data: { sampleInquiry: product.sampleInquiry + 1 },
    });
  }

  // 엑셀 다운로드 했을 때 + 1
  async modifyProductDownload({ productId }: { productId: number }) {
    const product = await this.fetchProduct({ productId });

    return await this.repository.updateProduct({
      where: { id: productId },
      data: { download: product.download + 1 },
    });
  }
}
