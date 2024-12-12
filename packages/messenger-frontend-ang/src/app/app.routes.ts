import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ChatComponent } from './components/chat/chat.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { authenticationGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: UserListComponent, canActivate: [authenticationGuard()] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'chat/:conversationId', component: ChatComponent },
];
