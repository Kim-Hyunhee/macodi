import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PinRepository } from './pin.repository';
import { SceneService } from '../scene/scene.service';
import { ProductOptionService } from '../product-option/product-option.service';
import { ProductService } from '../product/product.service';
import { createExcel } from 'src/helper/excel.download';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class PinService {
  constructor(
    private repository: PinRepository,
    private sceneService: SceneService,
    private productOptionService: ProductOptionService,
    private productService: ProductService,
    private uploadService: UploadService,
  ) {}

  async createPin({
    sceneId,
    userId,
    companyId,
    xCoordinate,
    yCoordinate,
    productOptionId,
  }: {
    sceneId: number;
    userId?: number;
    companyId?: number;
    xCoordinate: string;
    yCoordinate: string;
    productOptionId: number;
  }) {
    const productOption = await this.productOptionService.fetchProductOption({
      productOptionId,
    });

    const scene = await this.sceneService.fetchScene({
      userId,
      companyId,
      sceneId,
    });

    // 중복 생성 불가
    await this.fetchPin({ sceneId, productOptionId });

    const pins = await this.fetchManyPin({ userId, companyId });
    if (
      !pins.find((pin) => {
        return (
          pin.scene.projectId === scene.projectId &&
          productOption.productId === pin.productOption.productId
        );
      })
    ) {
      // 제품 프로젝트 적용 수 + 1
      await this.productService.modifyProductApplyProject({
        productId: productOption.productId,
      });
    }

    return await this.repository.insertPin({
      sceneId,
      xCoordinate,
      yCoordinate,
      productOptionId,
    });
  }

  async fetchPinById({
    pinId,
    userId,
    companyId,
  }: {
    pinId: number;
    userId?: number;
    companyId?: number;
  }) {
    const pin = await this.repository.findPin({ id: pinId });

    if (!pin) {
      throw new BadRequestException('pin does not exist...');
    }
    // 본인이 등록한 샘플 적용 제품이 아닐 경우 에러 처리
    if (userId) {
      if (pin.scene.project.userId !== userId) {
        throw new ForbiddenException('Forbidden error...');
      }
    } else if (companyId) {
      if (pin.scene.project.companyId !== companyId) {
        throw new ForbiddenException('Forbidden error...');
      }
    }

    return pin;
  }

  // 샘플 적용된 제품 삭제(여러 개 가능)
  async removeManyPin({
    userId,
    companyId,
    pinIds,
  }: {
    userId?: number;
    companyId?: number;
    pinIds: number[];
  }) {
    await Promise.all(
      pinIds.map(async (pinId) => {
        return await this.fetchPinById({ pinId, userId, companyId });
      }),
    );

    return await this.repository.deleteManyPin({ ids: pinIds });
  }

  // 샘플 적용된 제품 목록
  async fetchManyPin({
    userId,
    companyId,
  }: {
    userId?: number;
    companyId?: number;
  }) {
    if (userId) {
      return (await this.repository.findManyPin()).filter(
        (pin) => pin.scene.project.userId === userId,
      );
    } else if (companyId) {
      return (await this.repository.findManyPin()).filter(
        (pin) => pin.scene.project.companyId === companyId,
      );
    }
  }

  // my Palette에서 선택한 제품 엑셀 다운로드
  async downloadExcel({
    pinIds,
    userId,
    companyId,
  }: {
    pinIds: number[];
    userId?: number;
    companyId?: number;
  }) {
    const data = [];

    for (let i = 0; i < pinIds.length; i++) {
      const pin = await this.fetchPinById({
        pinId: pinIds[i],
        userId,
        companyId,
      });

      await this.productService.modifyProductDownload({
        productId: pin.productOption.productId,
      });

      // 엑셀 파일 생성 시 필요한 정보
      data.push({
        projectName: pin.scene.project.name,
        sceneTitle: pin.scene.title,
        productName: pin.productOption.product.name,
        size: pin.productOption.size,
        manufacturer: pin.productOption.product.manufacturer,
        subCategory: pin.productOption.product.subCategory,
        contactManagerName: pin.productOption.product.store.managerName,
        managerNumber: pin.productOption.product.store.managerNumber,
        companyName: pin.productOption.product.store.companyName,
        feature: pin.productOption.product.feature,
        origin: pin.productOption.product.origin,
        glossiness: pin.productOption.product.glossiness,
        image: pin.productOption.product.image,
        categoryName: pin.productOption.product.category.name,
        country: pin.productOption.product.country,
      });
    }

    const file = await createExcel({ data });

    // S3에 엑셀 파일 올리기
    return await this.uploadService.uploadExcelToS3(file);
  }

  // 샘플 적용 시 중복 방지를 위해 조건에 따른 샘플 검색
  async fetchPin({
    sceneId,
    productOptionId,
  }: {
    sceneId: number;
    productOptionId: number;
  }) {
    const pin = await this.repository.findPin({ sceneId, productOptionId });
    if (pin) {
      throw new BadRequestException('중복되는 샘플이 존재합니다.');
    }

    return pin;
  }
}
