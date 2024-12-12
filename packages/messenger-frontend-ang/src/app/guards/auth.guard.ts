import {CanActivate, CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {map, Observable} from 'rxjs';
import {inject} from '@angular/core';

export function authenticationGuard(): CanActivateFn {
  return () => {
    const authService: AuthService = inject(AuthService);
    const router = inject(Router);

    return authService.isLoggedIn().pipe(
      map((loggedIn) => {
        if (!loggedIn) {
          return router.createUrlTree(['/login'])
        }
        return loggedIn;
      })
    )
  };
}
