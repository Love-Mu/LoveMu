import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthenticationService, private route: Router) { }

  canActivate(): boolean {
    const check = this.authService.isAuthenticated()
    if (check) {
      return true;
    } else {
      this.route.navigate(['login']);
      return false;
    }
  }
}
