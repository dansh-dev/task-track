import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RedirectAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.user$.pipe(
      map(user => {
        return user
          ? this.router.createUrlTree(['/projects']) // 👈 redirect to tasks if already logged in
          : true; // allow access if NOT logged in
      })
    );
  }
}
