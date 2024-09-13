import * as ExcelJS from 'exceljs';
import axios from 'axios';

// 팔레트 제품 엑셀 다운로드
export const createExcel = async ({
  data,
}: {
  data: {
    projectName: string;
    sceneTitle: string;
    productName: string;
    size: string;
    manufacturer: string;
    subCategory: string;
    contactManagerName: string;
    managerNumber: string;
    companyName: string;
    feature: string;
    origin: string;
    country: string;
    glossiness: string;
    image: string;
    categoryName: string;
  }[];
}) => {
  const workBook = new ExcelJS.Workbook();
  for (let i = 0; i < data.length; i++) {
    const productData = data[i];
    // 시트 한 개 설정
    const workSheet = workBook.addWorksheet(`${productData.productName}`, {
      pageSetup: {
        paperSize: 9,
        printArea: 'B1:F22',
        fitToPage: true,
        margins: {
          left: 0.2,
          right: 0.2,
          top: 0.7,
          bottom: 0.7,
          header: 0.3,
          footer: 0.3,
        },
        horizontalCentered: true,
        verticalCentered: true,
      },
    });

    // 여러 셀 합치기
    workSheet.mergeCells('B1:F1');
    workSheet.mergeCells('B2:F2');
    workSheet.mergeCells('C4:F4');
    workSheet.mergeCells('C5:F5');
    workSheet.mergeCells('C6:F6');
    workSheet.mergeCells('C7:F7');
    workSheet.mergeCells('B8:F8');
    workSheet.mergeCells('B9:B13');
    workSheet.mergeCells('D9:F9');
    workSheet.mergeCells('D10:F10');
    workSheet.mergeCells('D11:F11');
    workSheet.mergeCells('D12:F12');
    workSheet.mergeCells('D13:F13');
    workSheet.mergeCells('B14:B16');
    workSheet.mergeCells('D14:E14');
    workSheet.mergeCells('D15:E15');
    workSheet.mergeCells('D16:F16');
    workSheet.mergeCells('F14:F15');
    workSheet.mergeCells('C17:F17');
    workSheet.mergeCells('C18:F18');
    workSheet.mergeCells('C19:F19');
    workSheet.mergeCells('B21:F21');

    // 합친 셀 중앙 정렬
    workSheet.getCell('B2').alignment = { vertical: 'middle' };
    workSheet.getCell('B3').alignment = { vertical: 'middle' };
    workSheet.getCell('B4').alignment = { vertical: 'middle' };
    workSheet.getCell('B5').alignment = { vertical: 'middle' };
    workSheet.getCell('B6').alignment = { vertical: 'middle' };
    workSheet.getCell('B7').alignment = { vertical: 'middle' };
    workSheet.getCell('B8').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    workSheet.getCell('B9').alignment = { vertical: 'middle' };
    workSheet.getCell('B10').alignment = { vertical: 'middle' };
    workSheet.getCell('B14').alignment = { vertical: 'middle' };
    workSheet.getCell('B17').alignment = { vertical: 'middle' };
    workSheet.getCell('B18').alignment = { vertical: 'middle' };
    workSheet.getCell('C9').alignment = { vertical: 'middle' };
    workSheet.getCell('C10').alignment = { vertical: 'middle' };
    workSheet.getCell('C11').alignment = { vertical: 'middle' };
    workSheet.getCell('C12').alignment = { vertical: 'middle' };
    workSheet.getCell('C13').alignment = { vertical: 'middle' };
    workSheet.getCell('C14').alignment = { vertical: 'middle' };
    workSheet.getCell('C15').alignment = { vertical: 'middle' };
    workSheet.getCell('C16').alignment = { vertical: 'middle' };
    workSheet.getCell('C17').alignment = { vertical: 'middle' };
    workSheet.getCell('C18').alignment = { vertical: 'middle' };
    workSheet.getCell('C19').alignment = { vertical: 'middle' };
    workSheet.getCell('F22').alignment = { horizontal: 'right' };
    workSheet.getCell('C4').alignment = { vertical: 'middle' };
    workSheet.getCell('C5').alignment = { vertical: 'middle' };
    workSheet.getCell('D9').alignment = { vertical: 'middle' };
    workSheet.getCell('D10').alignment = { vertical: 'middle' };
    workSheet.getCell('D11').alignment = { vertical: 'middle' };
    workSheet.getCell('D12').alignment = { vertical: 'middle' };
    workSheet.getCell('D13').alignment = { vertical: 'middle' };
    workSheet.getCell('D14').alignment = { vertical: 'middle' };
    workSheet.getCell('D15').alignment = { vertical: 'middle' };
    workSheet.getCell('D16').alignment = { vertical: 'middle' };
    workSheet.getCell('F14').alignment = { vertical: 'middle' };

    // 셀에 들어갈 내용 작성
    workSheet.getCell('B1').value = {
      richText: [
        {
          text: 'MATERIAL SPECIFICATION',
          font: {
            size: 14,
            name: '맑은 고딕',
            bold: true,
          },
        },
      ],
    };
    workSheet.getCell('B2').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '333333' },
    };
    workSheet.getCell('B4').value = {
      richText: [
        {
          text: ' PROJECT',
          font: {
            size: 11,
            name: '맑은 고딕',
            bold: true,
          },
        },
      ],
    };
    workSheet.getCell('B4').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };
    workSheet.getCell('B5').value = {
      richText: [
        {
          text: ' DATE',
          font: {
            size: 11,
            name: '맑은 고딕',
            bold: true,
          },
        },
      ],
    };
    workSheet.getCell('B5').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };
    workSheet.getCell('B6').value = {
      richText: [
        {
          text: ' MATERIAL NO.',
          font: {
            size: 11,
            name: '맑은 고딕',
            bold: true,
          },
        },
      ],
    };
    workSheet.getCell('B6').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };
    workSheet.getCell('B7').value = {
      richText: [
        {
          text: ' ITEM',
          font: {
            size: 11,
            name: '맑은 고딕',
            bold: true,
          },
        },
      ],
    };
    workSheet.getCell('B7').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };

    workSheet.getCell('B8').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };
    workSheet.getCell('B9').value = {
      richText: [
        {
          text: ' SPECIFICATION',
          font: {
            size: 11,
            name: '맑은 고딕',
            bold: true,
          },
        },
      ],
    };
    workSheet.getCell('B9').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };
    workSheet.getCell('B14').value = {
      richText: [
        {
          text: ' DISTRIBUTOR',
          font: {
            size: 11,
            name: '맑은 고딕',
            bold: true,
          },
        },
      ],
    };
    workSheet.getCell('B14').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };
    workSheet.getCell('B17').value = {
      richText: [
        {
          text: ' SEARCH ENGINE',
          font: {
            size: 11,
            name: '맑은 고딕',
            bold: true,
          },
        },
      ],
    };
    workSheet.getCell('B17').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };
    workSheet.getCell('B18').value = {
      richText: [
        {
          text: ' NOTES',
          font: {
            size: 10,
            name: '맑은 고딕',
          },
        },
      ],
    };

    workSheet.getCell('B21').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '333333' },
    };
    workSheet.getCell('C9').value = {
      richText: [
        {
          text: ' PRODUCT',
          font: {
            size: 11,
            name: '맑은 고딕',
          },
        },
      ],
    };
    workSheet.getCell('C9').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };
    workSheet.getCell('C10').value = {
      richText: [
        {
          text: ' LOCATION',
          font: {
            size: 11,
            name: '맑은 고딕',
          },
        },
      ],
    };
    workSheet.getCell('C10').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };
    workSheet.getCell('C11').value = {
      richText: [
        {
          text: ' GLOSSINESS',
          font: {
            size: 11,
            name: '맑은 고딕',
          },
        },
      ],
    };
    workSheet.getCell('C11').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };
    workSheet.getCell('C12').value = {
      richText: [
        {
          text: ' ORIGIN',
          font: {
            size: 11,
            name: '맑은 고딕',
          },
        },
      ],
    };
    workSheet.getCell('C12').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };
    workSheet.getCell('C13').value = {
      richText: [
        {
          text: ' SIZE(W*L*T)',
          font: {
            size: 11,
            name: '맑은 고딕',
          },
        },
      ],
    };
    workSheet.getCell('C13').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };
    workSheet.getCell('C14').value = {
      richText: [
        {
          text: ' CONTACT',
          font: {
            size: 11,
            name: '맑은 고딕',
          },
        },
      ],
    };
    workSheet.getCell('C14').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };
    workSheet.getCell('C15').value = {
      richText: [
        {
          text: ' PHONE',
          font: {
            size: 11,
            name: '맑은 고딕',
          },
        },
      ],
    };
    workSheet.getCell('C15').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };
    workSheet.getCell('C16').value = {
      richText: [
        {
          text: ' FEATURE',
          font: {
            size: 11,
            name: '맑은 고딕',
          },
        },
      ],
    };
    workSheet.getCell('C16').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };

    workSheet.getCell('C17').value = {
      richText: [
        {
          text: ' macodi.co.kr',
          font: {
            size: 11,
            name: '맑은 고딕',
          },
        },
      ],
    };
    workSheet.getCell('C17').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };
    workSheet.getCell('C18').value = {
      richText: [
        {
          text: " The sample is only designer's recommendation.",
          font: {
            size: 10,
            name: '맑은 고딕',
          },
        },
      ],
    };
    workSheet.getCell('C19').value = {
      richText: [
        {
          text: ' When installed, must be used same or higher grade item.',
          font: {
            size: 10,
            name: '맑은 고딕',
          },
        },
      ],
    };
    workSheet.getCell('F22').value = {
      richText: [
        {
          text: 'Material',
          font: {
            size: 11,
            name: '맑은 고딕',
          },
        },
      ],
    };
    workSheet.getCell('C4').value = {
      richText: [
        {
          text: ` ${productData.projectName}`,
          font: {
            size: 11,
            name: '맑은 고딕',
          },
        },
      ],
    };
    workSheet.getCell('C4').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    workSheet.getCell('C5').value = {
      richText: [
        {
          text: ` ${year}.${month}`,
          font: {
            size: 11,
            name: '맑은 고딕',
          },
        },
      ],
    };
    workSheet.getCell('C5').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };

    workSheet.getCell('C7').value = {
      richText: [
        {
          text: ` ${productData.categoryName}/${productData.subCategory}`,
          font: {
            size: 11,
            name: '맑은 고딕',
          },
        },
      ],
    };

    workSheet.getCell('C8').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };
    workSheet.getCell('D9').value = {
      richText: [
        {
          text: `${productData.manufacturer}/${productData.productName}`,
          font: {
            size: 11,
            name: '맑은 고딕',
          },
        },
      ],
    };
    workSheet.getCell('D9').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };
    workSheet.getCell('D10').value = {
      richText: [
        {
          text: `${productData.sceneTitle}`,
          font: {
            size: 11,
            name: '맑은 고딕',
          },
        },
      ],
    };
    workSheet.getCell('D10').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };
    workSheet.getCell('D11').value = {
      richText: [
        {
          text: `${productData.glossiness}`,
          font: {
            size: 11,
            name: '맑은 고딕',
          },
        },
      ],
    };
    workSheet.getCell('D11').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };
    workSheet.getCell('D12').value = {
      richText: [
        {
          text: `${productData.origin}/${productData.country}`,
          font: {
            size: 11,
            name: '맑은 고딕',
          },
        },
      ],
    };
    workSheet.getCell('D12').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };
    workSheet.getCell('D13').value = {
      richText: [
        {
          text: `${productData.size} (mm)`,
          font: {
            size: 11,
            name: '맑은 고딕',
          },
        },
      ],
    };
    workSheet.getCell('D13').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };
    workSheet.getCell('D14').value = {
      richText: [
        {
          text: `${productData.contactManagerName}`,
          font: {
            size: 11,
            name: '맑은 고딕',
          },
        },
      ],
    };
    workSheet.getCell('D14').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };
    workSheet.getCell('D15').value = {
      richText: [
        {
          text: `${productData.managerNumber}`,
          font: {
            size: 11,
            name: '맑은 고딕',
          },
        },
      ],
    };
    workSheet.getCell('D15').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };
    workSheet.getCell('D16').value = {
      richText: [
        {
          text: `${productData.feature}`,
          font: {
            size: 11,
            name: '맑은 고딕',
          },
        },
      ],
    };
    workSheet.getCell('D16').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };
    workSheet.getCell('F14').value = {
      richText: [
        {
          text: `${productData.companyName}`,
          font: {
            size: 11,
            name: '맑은 고딕',
          },
        },
      ],
    };
    workSheet.getCell('F14').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };

    workSheet.getCell('C6').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };
    workSheet.getCell('C7').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };
    workSheet.getCell('B9').border = {
      top: { style: 'hair' },
      left: { style: 'hair' },
      bottom: { style: 'hair' },
      right: { style: 'hair' },
    };

    // 이미지 삽입(이미지 주소 잘못 됐을 경우 '이미지없음')
    try {
      const response = await axios.get(productData.image, {
        responseType: 'arraybuffer',
      });
      const imageBuffer = Buffer.from(response.data, 'binary');
      const base64Image = imageBuffer.toString('base64');

      const imageId = workBook.addImage({
        base64: base64Image,
        extension: 'jpeg' || 'png',
      });
      const imageSize = 338;

      workSheet.addImage(imageId, {
        tl: { col: 2, row: 7.95 },
        ext: { width: imageSize, height: imageSize },
      });
    } catch (error) {
      workSheet.getCell('B8').value = {
        richText: [
          {
            text: `이미지 없음`,
            font: {
              size: 25,
              name: '맑은 고딕',
            },
          },
        ],
      };
    }

    // 셀 높이, 너비 설정
    workSheet.getRow(1).height = 30.75;
    workSheet.getRow(2).height = 3;
    workSheet.getRow(3).height = 10.5;
    workSheet.getRow(4).height = 21.75;
    workSheet.getRow(5).height = 21.75;
    workSheet.getRow(6).height = 21.75;
    workSheet.getRow(7).height = 21.75;
    workSheet.getRow(8).height = 321.75;
    workSheet.getRow(9).height = 21.75;
    workSheet.getRow(10).height = 21.75;
    workSheet.getRow(11).height = 21.75;
    workSheet.getRow(12).height = 21.75;
    workSheet.getRow(13).height = 21.75;
    workSheet.getRow(14).height = 21.75;
    workSheet.getRow(15).height = 21.75;
    workSheet.getRow(16).height = 21.75;
    workSheet.getRow(17).height = 21.75;
    workSheet.getRow(18).height = 21.75;
    workSheet.getRow(19).height = 16.5;
    workSheet.getRow(20).height = 6.75;
    workSheet.getRow(21).height = 3.0;
    workSheet.getRow(22).height = 16.5;

    workSheet.getColumn(1).width = 2;
    workSheet.getColumn(2).width = 18;
    workSheet.getColumn(3).width = 12;
    workSheet.getColumn(4).width = 11;
    workSheet.getColumn(5).width = 10;
    workSheet.getColumn(6).width = 26;
  }

  // 엑셀 생성 및 에러 처리
  return workBook.xlsx
    .writeBuffer()
    .then((buffer) => {
      console.log('Excel file created successfully.');
      return buffer;
    })
    .catch((error) => {
      console.error('Error creating Excel file:', error);
      return error;
    });
};
