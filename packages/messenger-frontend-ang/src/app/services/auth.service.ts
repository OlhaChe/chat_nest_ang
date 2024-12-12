import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {
  }

  login(data: { userName: string, password: string}) {
    return this.http.post<{accessToken: string}>(`${environment.apiUrl}/auth/sign-in`, data).pipe(
      tap((response) => {
        localStorage.setItem('accessToken', response.accessToken);
        this.loggedIn.next(true);
      }),
      catchError(this.handleError)
    )
  }

  register(data: { userName: string, email: string, password: string}) {
    return this.http.post<{accessToken: string}>(`${environment.apiUrl}/auth/sign-up`, data).pipe(
      tap((response) => {
        localStorage.setItem('accessToken', response.accessToken);
        this.loggedIn.next(true);
      }),
      catchError(this.handleError)
    )
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  private hasToken() {
    return !!localStorage.getItem('accessToken');
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {

    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}
