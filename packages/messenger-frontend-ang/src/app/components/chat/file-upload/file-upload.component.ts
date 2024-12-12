import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadService } from '../../../services/file-upload.service';

export interface FileModel {
  id?: number;
  name: string;
  status?: 'Uploaded' | 'Uploading' | 'Failed';
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  imports: [CommonModule],
})
export class FileUploadComponent {
  @Input() set initialFiles(files: FileModel[]) {
    this.files = files.map((x) => ({ ...x, status: 'Uploaded' }));
  }

  files: FileModel[] = [];
  @Output() filesChange = new EventEmitter<FileModel[]>();
  @Output() uploading = new EventEmitter<boolean>();
  uploadedFileIds: number[] = [];
  ongoingUploads = 0;

  constructor(private service: FileUploadService) {}

  onFileSelected(event: any): void {
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileData: FileModel = { name: file.name, status: 'Uploading' };
      this.files.push(fileData);

      this.uploadFile(file, fileData);
    }
  }

  uploadFile(file: File, fileData: FileModel): void {
    this.ongoingUploads++;
    this.uploading.emit(true);

    this.service.uploadFile(this.createFormData(file)).subscribe({
      next: (response) => {
        if (response.id) {
          fileData.id = +response.id;
          fileData.status = 'Uploaded';
          this.uploadedFileIds.push(+response.id);
          this.emitUploadedFileIds();
        }
      },
      error: () => {
        fileData.status = 'Failed';
      },
      complete: () => {
        this.ongoingUploads--;
        if (this.ongoingUploads === 0) {
          this.uploading.emit(false);
        }
      },
    });
  }

  createFormData(file: File): FormData {
    const formData = new FormData();
    formData.append('file', file);
    return formData;
  }

  emitUploadedFileIds(): void {
    this.filesChange.emit(this.files);
  }

  deleteFile(index: number) {
    this.files.splice(index, 1);
    this.filesChange.emit(this.files);
  }

  clearFiles(): void {
    this.files = [];
    this.uploadedFileIds = [];
    this.ongoingUploads = 0;
    this.uploading.emit(false);
  }
}
