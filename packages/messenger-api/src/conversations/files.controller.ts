import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const filename = `${uuid()}${path.extname(file.originalname)}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException();
    }
    const savedFile = await this.fileUploadService.saveFile(
      file.originalname,
      file.filename,
      file.path,
    );
    return { id: savedFile.id, path: file.path };
  }
}
