import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileAttachment } from 'src/domain/entities/file-attachment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(FileAttachment)
    private readonly fileRepository: Repository<FileAttachment>,
  ) {}

  async saveFile(
    originalFilename: string,
    filename: string,
    path: string,
  ): Promise<FileAttachment> {
    const file = this.fileRepository.create({
      originalFilename,
      filename,
      path,
    });
    return this.fileRepository.save(file);
  }

  async deleteFile(fileId: string): Promise<void> {
    await this.fileRepository.delete(fileId);
  }
}
