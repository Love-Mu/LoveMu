import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
//import { NavbarComponent } from './navbar/navbar.component'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public usrAuthed: boolean;

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) { }

  public isAuthenticated(): boolean {
    const userData = this.cookieService.get('id');
    if (userData && JSON.parse(userData) && this.http.get('https://lovemu.compsoc.ie/auth/query')) {
      this.usrAuthed = true;
      return true;
    }
  }

  public setAuth(bool): void {
    this.usrAuthed = bool;
  }

  public verify() {
    this.http.get('https://lovemu.compsoc.ie/auth/query').subscribe((res) => {
      if (!res) {
        this.cookieService.deleteAll('/', 'lovemu.compsoc.ie');
        this.router.navigate(['/login']);
      }
    });
  }
  
  public logout() {
    return this.http.post('https://lovemu.compsoc.ie/auth/logout', {}).subscribe((res) => {
      this.cookieService.deleteAll('/', '.lovemu.compsoc.ie');
      this.router.navigate(['/']);
      this.usrAuthed = false;
      console.log("Logged Out Succesfully!");
    });
  };

  public getCurrentUserID() {
    const id = this.cookieService.get('id');
    return JSON.parse(id);
  }

  public setUserInfo(id) {
    this.cookieService.set('id', JSON.stringify(id), 0, '/', 'lovemu.compsoc.ie', true);
  }

  public validate(email, password) {
    return this.http.post('https://lovemu.compsoc.ie/auth/login', {email, password}).subscribe((res) => {
      //this.navbar.changeAuth(true);
      this.setUserInfo({'id': res['user']});
      this.usrAuthed = true;
      this.router.navigate(['/']);
    });
  }
}