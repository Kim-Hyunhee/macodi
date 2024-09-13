import * as path from 'path';
import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private awsS3: S3;
  private S3_BUCKET_NAME: string;

  // .env 파일 읽어오기
  constructor(private readonly configService: ConfigService) {
    this.awsS3 = new S3({
      region: this.configService.get('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
      },
    });
    this.S3_BUCKET_NAME = this.configService.get('AWS_S3_BUCKET_NAME');
  }

  async uploadFileToS3(file: Express.Multer.File) {
    try {
      const fileName = Buffer.from(file.originalname, 'latin1')
        .toString('utf8')
        .replace(/[^\w\s.가-힣]/g, '')
        .replaceAll(' ', '');
      const key = `${Date.now()}/${path.basename(fileName)}`;

      const putObjectCommand = new PutObjectCommand({
        Bucket: this.S3_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
      });

      await this.awsS3.send(putObjectCommand);

      const url = `https://${this.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;

      return url;
    } catch (error) {
      throw new BadRequestException(`File upload failed: ${error}`);
    }
  }

  // 이미지 대량 업로드(엑셀로 업로드 시 이미지 주소 동일하게)
  async uploadManyFileToS3({
    files,
    storeId,
  }: {
    files: Express.Multer.File[];
    storeId: number;
  }) {
    try {
      // 한글 이름 유니코드로 저장 안 되게 수정
      const uploadPromises = files.map(async (file) => {
        const fileName = Buffer.from(file.originalname, 'latin1')
          .toString('utf8')
          .replace(/[^\w\s.가-힣]/g, '')
          .replaceAll(' ', '');
        const key = `${storeId}/${fileName}`;

        const putObjectCommand = new PutObjectCommand({
          Bucket: this.S3_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ACL: 'public-read',
          ContentType: file.mimetype,
        });

        await this.awsS3.send(putObjectCommand);

        const url = `https://${this.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;

        return url;
      });

      const uploadResults = await Promise.all(uploadPromises);

      return uploadResults;
    } catch (error) {
      throw new BadRequestException(`File upload failed: ${error}`);
    }
  }

  async uploadExcelToS3(stream: Buffer) {
    try {
      const key = `${Date.now()}/material_files_${Date.now()}.xlsx`;

      const putObjectCommand = new PutObjectCommand({
        Bucket: this.S3_BUCKET_NAME,
        Key: key,
        Body: stream,
        ACL: 'public-read',
        ContentType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      await this.awsS3.send(putObjectCommand);

      const url = `https://${this.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;

      return url;
    } catch (error) {
      throw new BadRequestException(`File upload failed: ${error}`);
    }
  }
}
