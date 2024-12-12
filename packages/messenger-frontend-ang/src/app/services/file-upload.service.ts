import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  constructor(private http: HttpClient) {}

  uploadFile(formData: FormData) {
    return this.http.post<{id: string}>(`${environment.apiUrl}/files/upload`, formData);
  }
}
