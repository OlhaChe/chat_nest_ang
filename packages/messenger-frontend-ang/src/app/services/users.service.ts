import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Users } from '../models/users';

@Injectable({providedIn: 'root'})
export class UsersService {
  constructor(private http: HttpClient) {}

  getUsersConversation() {
    return this.http.get<{
      withChats: any[],
      withoutChats: any[]
    }>(`${environment.apiUrl}/users/user-conversation`);
  }
}
