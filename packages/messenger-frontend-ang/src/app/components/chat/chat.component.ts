import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatSocketService } from '../../services/chat.socket.service';
import {
  FileModel,
  FileUploadComponent,
} from './file-upload/file-upload.component';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule, FileUploadComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  newMessage: string = '';
  selectedMessage: any = null;
  isEditing: boolean = false;
  editingMessage: string = '';
  private conversationId: string | null = null;

  @ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;
  uploadedFileIds: number[] = [];
  isUploading = false;

  constructor(
    private route: ActivatedRoute,
    private chatSocketService: ChatSocketService,
  ) {}

  onUploadStatusChange(uploading: boolean): void {
    this.isUploading = uploading;
  }

  onFilesChanged(files: FileModel[]): void {
    this.uploadedFileIds = files
      .filter((x) => x.id && x.status === 'Uploaded')
      .map((x) => x.id!);
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.conversationId = params.get('conversationId');
      if (this.conversationId) {
        this.loadMessages(+this.conversationId!);
        this.listenForNewMessages(+this.conversationId!);
        this.listenForMessageUpdate(+this.conversationId);
        this.listenForMessageDeletion(+this.conversationId);
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    this.chatSocketService.sendMessage({
      conversationId: +this.conversationId!,
      message: this.newMessage,
      fileIds: this.uploadedFileIds || [],
    });
    this.newMessage = '';
    this.uploadedFileIds = [];
    this.fileUploadComponent.clearFiles();
  }

  loadMessages(conversationId: number): void {
    this.chatSocketService
      .fetchMessages(conversationId)
      .subscribe((messages) => {
        this.messages = messages;
        console.log(messages);
      });
  }

  listenForNewMessages(conversationId: number) {
    this.chatSocketService.onMessage(conversationId).subscribe((message) => {
      this.messages.push(message);
    });
  }

  listenForMessageUpdate(conversationId: number) {
    this.chatSocketService
      .onEditMessage(conversationId)
      .subscribe((message: any) => {
        const index = this.messages.findIndex(
          (m) => m.messageId === message.messageId,
        );
        if (index !== -1) {
          this.messages[index] = message;
        }

        this.isEditing = false;
        this.selectedMessage = null;
        this.editingMessage = '';
        this.uploadedFileIds = [];
        this.fileUploadComponent.clearFiles();
      });
  }

  listenForMessageDeletion(conversationId: number) {
    this.chatSocketService
      .onDeleteMessage(conversationId)
      .subscribe((messageId: any) => {
        console.log(messageId);
        this.messages = this.messages.filter((m) => m.messageId !== messageId);
        this.selectedMessage = null;
      });
  }

  ngOnDestroy(): void {
    this.chatSocketService.disconnect();
    // document.removeEventListener('click', this.onDocumentClick);
  }

  onMessageContextMenu(event: MouseEvent, message: any) {
    event.preventDefault(); // Prevent default context menu
    this.selectedMessage = message;
  }

  editMessage(message: any) {
    this.isEditing = true;
    this.editingMessage = message.content;
    this.selectedMessage = message;
  }

  saveEditedMessage() {
    if (!this.editingMessage.trim()) return;

    this.chatSocketService.editMessage({
      messageId: this.selectedMessage.messageId,
      conversationId: +this.conversationId!,
      newMessage: this.editingMessage,
      fileIds: this.uploadedFileIds || [],
    });
  }

  deleteMessage(message: any) {
    this.chatSocketService.deleteMessage({
      messageId: message.messageId,
      conversationId: +this.conversationId!,
    });
  }

}
