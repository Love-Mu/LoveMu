import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) { }

  public isAuthenticated(): boolean {

    const userData = this.cookieService.get('id');

    if (userData && JSON.parse(userData)) {
      return true;
    }
    return false;
  } 
  
  public logout(): void {
    this.cookieService.delete('id');
  }

  public setUserInfo(id) {
    this.cookieService.set('id', JSON.stringify(id), 7, '/', 'lovemu.compsoc.ie', true);
  }

  public validate(email, password) {
    return this.http.post('https://lovemu.compsoc.ie/auth/login', {email, password}).subscribe((res) => {
      this.setUserInfo({'id': res['user']});
      this.router.navigate(['/']);
    });
  }
}