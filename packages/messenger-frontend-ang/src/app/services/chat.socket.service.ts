import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatSocketService {
  private socket!: Socket;

  constructor() {
    this.connect();
  }

  // Connect to the WebSocket server
  private connect(): void {
    const token = localStorage.getItem('accessToken');
    this.socket = io('http://localhost:3000', {
      query: { token },
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });
  }

  sendMessage(payload: {
    conversationId: number;
    message: string;
    fileIds: number[];
  }): void {
    this.socket.emit('send_message', payload);
  }

  fetchMessages(conversationId: number): Observable<any> {
    return new Observable((observer) => {
      this.socket.emit('fetch_messages', { conversationId });
      this.socket.on(`conversation_${conversationId}`, (response) => {
        if (response.type === 'bulk') {
          observer.next(response.data);
        }
      });
    });
  }

  onMessage(conversationId: number): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(`conversation_${conversationId}`, (response) => {
        if (response.type === 'single') {
          observer.next(response.data);
        }
      });
    });
  }

  onEditMessage(conversationId: number) {
    return new Observable((observer) => {
      this.socket.on(`message_edited_in_${conversationId}`, (response) => {
        if (response.type === 'update') {
          observer.next(response.data);
        }
      });
    });
  }

  onDeleteMessage(conversationId: number) {
    return new Observable((observer) => {
      this.socket.on(`message_edited_in_${conversationId}`, (response) => {
        if (response.type === 'delete') {
          observer.next(response.data);
        }
      });
    });
  }

  editMessage(payload: {
    messageId: string;
    conversationId: number;
    newMessage: string,
    fileIds: number[]
  }) {
      this.socket.emit('edit_message', payload);
  }

  deleteMessage(payload: {
    messageId: string;
    conversationId: number
  }){
    this.socket.emit('delete_message', payload);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
