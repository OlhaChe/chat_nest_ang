import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { Users } from '../../models/users';
import { ConversationService } from '../../services/conversation.service';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe'

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
  imports: [CommonModule, TimeAgoPipe]
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  userWithChats: any[] = [];
  usersWithoutChats: any[] = [];


  constructor(
    private readonly router: Router,
    private usersService: UsersService,
    private conversationService: ConversationService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.usersService.getUsersConversation().subscribe(
      (data) => {
        this.userWithChats = data.withChats;
        this.usersWithoutChats = data.withoutChats;
        console.log(this.userWithChats);
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }

  openChat(userId: number) {
    let test = this.conversationService.createOrGetConversation(userId)
     .subscribe(
      (conversation) => {
        this.router.navigate(['/chat', conversation.conversationId]);
      },
    (error) => {
        console.error('Can`t open chat', error);
      }
    );
  }

  truncate(value: string, limit = 20): string {
    return value.length > limit ? `${value.substring(0, limit)}...` : value;
  }
}
