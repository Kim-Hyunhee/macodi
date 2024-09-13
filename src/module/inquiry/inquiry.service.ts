import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InquiryRepository } from './inquiry.repository';
import { PinService } from '../pin/pin.service';
import { ProjectService } from '../project/project.service';
import { ProductService } from '../product/product.service';
import { checkInquiryCode } from 'src/helper/randomCode';
import { CompanyService } from '../company/company.service';
import { AligoService } from '../aligo/aligo.service';

@Injectable()
export class InquiryService {
  constructor(
    private repository: InquiryRepository,
    private pinService: PinService,
    private projectService: ProjectService,
    private productService: ProductService,
    private companyService: CompanyService,
    private aligoService: AligoService,
  ) {}

  // 샘플 문의 생성
  async createInquiry({
    companyId,
    pinIdInfo,
    projectId,
    receiver,
    address,
    contactNumber,
  }: {
    companyId: number;
    projectId: number;
    pinIdInfo: { pinId: number; squareMeasure: number }[];
    receiver: string;
    address: string;
    contactNumber: string;
  }) {
    const productIds = [];
    const phoneNumbers = [];

    await Promise.all(
      pinIdInfo.map(async ({ pinId }) => {
        const pin = await this.pinService.fetchPinById({
          pinId,
          companyId,
        });
        // projectId와 받은 pinId 중에서 같은 project 내에 있지 않는 경우 에러 처리
        if (projectId !== pin.scene.projectId) {
          throw new BadRequestException('Please check the pin ID again.');
        }

        productIds.push(pin.productOption.productId);

        phoneNumbers.push(pin.productOption.product.store.managerNumber);

        return pin;
      }),
    );

    // 같은 제품일 경우 중복 제거 후 샘플 문의 수 + 1
    const setProductIds = new Set(productIds);
    const uniqueArr = [...setProductIds];
    await Promise.all(
      uniqueArr.map(async (productId) => {
        await this.productService.modifyProductSampleInquiry({ productId });
      }),
    );

    await this.projectService.fetchProject({ projectId, companyId });

    const inquiries = await this.repository.findOnlyManyInquiry();
    const inquiryNumber = await checkInquiryCode({ inquiries });

    // 샘플 신청한 전문가 회원에게 문자 보내기
    const company = await this.companyService.fetchCompanyById({ companyId });
    const message = `샘플신청이 접수되었습니다. 제품별 파트너사가 직접 연락드릴꺼에요. 감사합니다. -마코디-`;
    await this.aligoService.sendSMS({
      phoneNumber: contactNumber,
      msg: message,
      sender: '02-3456-7117',
      type: 'SMS',
    });

    // 공급자 연락처 중복 제거 후 한꺼번에 보내기
    const uniquePhoneNumbers = Array.from(new Set(phoneNumbers));

    for (const phoneNumber of uniquePhoneNumbers) {
      const message = `${company.managerName}님의 샘플요청이 들어왔습니다. 샘플문의 신청내용을 확인하세요. -마코디-`;

      try {
        await this.aligoService.sendSMS({
          phoneNumber: phoneNumber,
          msg: message,
          sender: '02-3456-7117',
          type: 'SMS',
        });
      } catch (error) {
        return new Error(`Error sending SMS to ${phoneNumber}: ${error}`);
      }
    }

    return this.repository.insertInquiry({
      projectId,
      pinIdInfo,
      companyId,
      receiver,
      address,
      contactNumber,
      inquiryNumber,
    });
  }

  // 샘플 문의 목록
  async fetchManyInquiry({
    projectId,
    companyId,
  }: {
    projectId: number;
    companyId: number;
  }) {
    await this.projectService.fetchProject({ projectId, companyId });

    return await this.repository.findManyInquiry({
      companyId,
      projectId,
    });
  }

  // 특정 샘플 문의 내역
  async fetchInquiry({
    companyId,
    inquiryId,
  }: {
    companyId: number;
    inquiryId: number;
  }) {
    const inquiry = await this.repository.findInquiry({ id: inquiryId });
    // 샘플 문의가 DB에 없을 경우 에러 처리
    if (!inquiry) {
      throw new BadRequestException('Inquiry does not exist...');
    }
    // 샘플 문의 생성한 전문가 회원Id와 본인Id 비교
    if (inquiry.companyId !== companyId) {
      throw new ForbiddenException('Forbidden error...');
    }

    return inquiry;
  }

  // 특정 샘플 문의 내역 삭제(여러 개 가능)
  async removeManyInquiry({
    companyId,
    inquiryIds,
  }: {
    companyId: number;
    inquiryIds: number[];
  }) {
    // 본인이 생성한 샘플 문의가 맞는지 확인 후 삭제
    await Promise.all(
      inquiryIds.map(async (inquiryId) => {
        return await this.fetchInquiry({ companyId, inquiryId });
      }),
    );

    return await this.repository.deleteManyInquiry({ ids: inquiryIds });
  }

  // 받은 샘플 문의 내역 목록(공급자 또는 관리자)
  async fetchManyInquiryPin({
    storeId,
    adminId,
    startDate,
    endDate,
    keyword,
    page,
    item,
    range,
  }: {
    storeId?: number;
    adminId?: number;
    startDate?: Date;
    endDate?: Date;
    keyword?: string;
    page?: number;
    item?: string;
    range?: string;
  }) {
    if (!adminId && !storeId) {
      throw new ForbiddenException(
        'You are not authorized to access this api.',
      );
    }

    startDate ? new Date(startDate) : undefined;
    endDate ? new Date(startDate) : undefined;

    const inquiries = await this.repository.findManyInquiryPin({
      where: { page },
      searchOptions: { startDate, endDate, keyword },
      storeId,
    });

    // 정렬(오름차순, 내림차순)
    if (item === 'address' && (range === 'asc' || range === 'desc')) {
      const inquiryList = inquiries.inquiryPin.sort((a, b) => {
        if (a.inquiry.address < b.inquiry.address) {
          return range === 'asc' ? -1 : 1;
        } else if (a.inquiry.address > b.inquiry.address) {
          return range === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      });
      return {
        inquiryPin: inquiryList,
        total: inquiries.total,
        next: inquiries.next,
      };
    } else if (
      item === 'productName' &&
      (range === 'asc' || range === 'desc')
    ) {
      const inquiryList = inquiries.inquiryPin.sort((a, b) => {
        if (
          a.pin.productOption.product.name < b.pin.productOption.product.name
        ) {
          return range === 'asc' ? -1 : 1;
        } else if (
          a.pin.productOption.product.name > b.pin.productOption.product.name
        ) {
          return range === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      });
      return {
        inquiryPin: inquiryList,
        total: inquiries.total,
        next: inquiries.next,
      };
    } else if (
      item === 'companyName' &&
      (range === 'asc' || range === 'desc')
    ) {
      const inquiryList = inquiries.inquiryPin.sort((a, b) => {
        if (
          a.pin.scene.project.company.name < b.pin.scene.project.company.name
        ) {
          return range === 'asc' ? -1 : 1;
        } else if (
          a.pin.scene.project.company.name > b.pin.scene.project.company.name
        ) {
          return range === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      });
      return {
        inquiryPin: inquiryList,
        total: inquiries.total,
        next: inquiries.next,
      };
    } else if (
      item === 'inquiryNumber' &&
      (range === 'asc' || range === 'desc')
    ) {
      const inquiryList = inquiries.inquiryPin.sort((a, b) => {
        if (a.inquiry.inquiryNumber < b.inquiry.inquiryNumber) {
          return range === 'asc' ? -1 : 1;
        } else if (a.inquiry.inquiryNumber > b.inquiry.inquiryNumber) {
          return range === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      });
      return {
        inquiryPin: inquiryList,
        total: inquiries.total,
        next: inquiries.next,
      };
    } else if (item === 'receiver' && (range === 'asc' || range === 'desc')) {
      const inquiryList = inquiries.inquiryPin.sort((a, b) => {
        if (a.inquiry.receiver < b.inquiry.receiver) {
          return range === 'asc' ? -1 : 1;
        } else if (a.inquiry.receiver > b.inquiry.receiver) {
          return range === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      });
      return {
        inquiryPin: inquiryList,
        total: inquiries.total,
        next: inquiries.next,
      };
    } else if (item === 'createdAt' && (range === 'asc' || range === 'desc')) {
      const inquiryList = inquiries.inquiryPin.sort((a, b) => {
        if (a.inquiry.createdAt < b.inquiry.createdAt) {
          return range === 'asc' ? -1 : 1;
        } else if (a.inquiry.createdAt > b.inquiry.createdAt) {
          return range === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      });
      return {
        inquiryPin: inquiryList,
        total: inquiries.total,
        next: inquiries.next,
      };
    }

    return inquiries;
  }

  // 특정 샘플 문의 제품 상담 완료(상태 변경)
  async modifyInquiryPinComplete({
    inquiryPinId,
    isCompleted,
    storeId,
  }: {
    inquiryPinId: number;
    isCompleted: boolean;
    storeId?: number;
  }) {
    const inquiryPin = await this.repository.findInquiryPin({
      id: inquiryPinId,
    });
    if (!inquiryPin) {
      throw new BadRequestException('존재 하지 않는 샘플 문의 입니다.');
    }
    if (storeId) {
      if (inquiryPin.pin.productOption.product.storeId !== storeId) {
        throw new BadRequestException('존재하지 않는 샘플 문의 입니다.');
      }
    }

    return await this.repository.updateInquiryPinComplete({
      where: { id: inquiryPinId },
      data: { isCompleted },
    });
  }
}
