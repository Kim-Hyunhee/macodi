import { Inquiry, Product } from '@prisma/client';

// 제품 랜덤 코드(중복 시 재생성)
export const checkProductCode = async ({
  products,
}: {
  products: Product[];
}) => {
  let flag = true;

  while (flag) {
    const productCode = 'M-' + Math.floor(Math.random() * 10000000000);

    if (products.find((product) => productCode !== product.code)) {
      flag = false;
    }

    return productCode;
  }
};

// 샘플 문의 랜덤 코드 생성(중복 시 재생성)
export const checkInquiryCode = async ({
  inquiries,
}: {
  inquiries: Inquiry[];
}) => {
  let flag = true;

  while (flag) {
    const inquiryCode = String(Math.floor(Math.random() * 10000000000));

    if (inquiries.find((inquiry) => inquiryCode !== inquiry.inquiryNumber)) {
      flag = false;
    }

    return inquiryCode;
  }
};
