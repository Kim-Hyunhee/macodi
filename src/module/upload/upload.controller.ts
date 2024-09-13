import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiConsumes, ApiTags, ApiBody } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async postUpload(@UploadedFile() file: Express.Multer.File) {
    return await this.uploadService.uploadFileToS3(file);
  }

  @Post('/store/:id/product')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async postManyUpload(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id', ParseIntPipe) storeId: number,
  ) {
    return await this.uploadService.uploadManyFileToS3({ files, storeId });
  }
}
