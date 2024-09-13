import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InquiryRepository {
  constructor(private prisma: PrismaService) {}

  // 샘플(Inquiry) 테이블에 정보 저장
  async insertInquiry(data: InsertInquiry) {
    const { pinIdInfo, ...other } = data;
    const inquiry = await this.prisma.inquiry.create({ data: other });

    // 샘플&제품(InquiryPin) 테이블에 여러 데이터 저장
    await this.prisma.$transaction(
      data.pinIdInfo.map(({ pinId }) =>
        this.prisma.inquiryPin.create({
          data: {
            pinId,
            inquiryId: inquiry.id,
          },
        }),
      ),
    );

    // 샘플 문의 시 선택된 제품 면적(m2) 수정
    await this.prisma.$transaction(
      data.pinIdInfo.map(({ pinId, squareMeasure }) =>
        this.prisma.pin.update({
          data: { squareMeasure },
          where: { id: pinId },
        }),
      ),
    );

    return true;
  }

  // 샘플(Inquiry) 테이블에서 조건에 맞는 배열
  async findManyInquiry(where: { projectId: number; companyId: number }) {
    return await this.prisma.inquiry.findMany({
      where,
      include: {
        inquiryPins: {
          include: {
            pin: {
              include: {
                scene: {
                  include: {
                    project: { include: { company: true } },
                  },
                },
                productOption: {
                  include: {
                    product: {
                      include: {
                        category: true,
                        purpose: true,
                        location: true,
                        store: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  // 샘플(Inquiry) 테이블에서 조건에 맞는 첫 번째 줄
  async findInquiry(where: { id: number }) {
    return await this.prisma.inquiry.findUnique({
      where,
      include: {
        inquiryPins: {
          include: {
            pin: { include: { scene: { include: { project: true } } } },
          },
        },
      },
    });
  }

  // 샘플(Inquiry) 테이블에서 해당 id 삭제
  async deleteManyInquiry(where: { ids: number[] }) {
    return await this.prisma.inquiry.deleteMany({
      where: { id: { in: where.ids } },
    });
  }

  // 샘플(Inquiry) 테이블에 있는 모든 배열
  async findOnlyManyInquiry() {
    return await this.prisma.inquiry.findMany();
  }

  // 샘플&제품(InquiryPin) 테이블에서 조건에 맞는 배열
  async findManyInquiryPin({
    where,
    searchOptions,
    storeId,
  }: {
    where: { page?: number };
    searchOptions?: {
      startDate?: Date;
      endDate?: Date;
      keyword?: string;
    };
    storeId?: number;
  }) {
    const PAGE_SIZE = 10;
    const skipAmount = where.page ? (where.page - 1) * PAGE_SIZE : 0;

    const AND = [];
    if (searchOptions.startDate && searchOptions.endDate) {
      AND.push({
        inquiry: {
          createdAt: {
            gte: new Date(searchOptions?.startDate),
            lte: new Date(searchOptions?.endDate),
          },
        },
      });
    }

    if (storeId) {
      AND.push({ pin: { productOption: { product: { storeId } } } });
    }

    if (searchOptions.keyword) {
      AND.push({
        OR: [
          { inquiry: { receiver: { contains: searchOptions.keyword } } },
          { inquiry: { inquiryNumber: { contains: searchOptions.keyword } } },
          {
            pin: {
              scene: { project: { name: { contains: searchOptions.keyword } } },
            },
          },
          {
            pin: {
              scene: {
                project: {
                  company: { name: { contains: searchOptions.keyword } },
                },
              },
            },
          },
          {
            pin: {
              productOption: {
                product: { name: { contains: searchOptions.keyword } },
              },
            },
          },
        ],
      });
    }

    const inquiryPin = await this.prisma.inquiryPin.findMany({
      skip: skipAmount,
      take: PAGE_SIZE,
      where: {
        AND: AND.length > 0 ? AND : undefined,
      },
      include: {
        pin: {
          include: {
            productOption: {
              include: { product: { include: { store: true } } },
            },
            scene: { include: { project: { include: { company: true } } } },
          },
        },
        inquiry: true,
      },
    });

    const total = await this.prisma.inquiryPin.count({
      where: {
        AND: AND.length > 0 ? AND : undefined,
      },
    });
    const next = total - PAGE_SIZE * where.page < 0 ? null : where.page + 1;

    return { inquiryPin, total, next };
  }

  // 샘플&제품(InquiryPin) 테이블에서 해당 id 정보 변경
  async updateInquiryPinComplete({
    where,
    data,
  }: {
    where: { id: number };
    data: { isCompleted: boolean };
  }) {
    return await this.prisma.inquiryPin.update({ where, data });
  }

  // 샘플&제품(InquiryPin) 테이블에서 조건에 맞는 첫 번째 줄
  async findInquiryPin(where: { id: number }) {
    return await this.prisma.inquiryPin.findUnique({
      where,
      include: {
        pin: { include: { productOption: { include: { product: true } } } },
      },
    });
  }
}

type InsertInquiry = {
  projectId: number;
  pinIdInfo: { pinId: number; squareMeasure: number }[];
  companyId: number;
  receiver: string;
  address: string;
  contactNumber: string;
  inquiryNumber: string;
};
