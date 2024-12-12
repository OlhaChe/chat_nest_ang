import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Conversation } from '../models/conversation';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  constructor(private http: HttpClient) {}

  createOrGetConversation(otherUserId: number) {
    return this.http.post<Conversation>(`${environment.apiUrl}/conversations`, { otherUserId });
  }
}
