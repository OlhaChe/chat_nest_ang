import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router, RouterLink} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  errorMessage: string | undefined;
  registerForm = new FormGroup({
    userName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router) {}

  register() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value as any).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => (this.errorMessage = err.message),
      });
    }
  }
}
