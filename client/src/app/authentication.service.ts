import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse   } from '@angular/common/http';
import { UsersService } from './users.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private userService: UsersService, private http: HttpClient, private router: Router) { }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      return true;
    } else {
      return false;
    }
  }

  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    this.router.navigate(['/']);
  };

  public getCurrentUserID() {
    return localStorage.getItem('id');
  }

  public setUserInfo(token, id) {
    localStorage.setItem('token', token);
    localStorage.setItem('id', id)
  }

  public validate(email, password) {
    this.http.post('https://lovemu.compsoc.ie/auth/login', {email, password}).subscribe((res) => {
      let token = res['token'];
      let id = res['id'];
      this.setUserInfo(token, id);
      this.router.navigate(['/']);
    }, (e) => {
      if (e instanceof HttpErrorResponse) {
        console.log(e.error.message);
      }
    });
  }

  public googleValidate() {
    const url = window.location.href;
    const queryParams = url.substring(26);
    if (queryParams.length > 0) {
      let tempArr = queryParams.split('=');
      if (tempArr[0] === '?google_token' && tempArr.length == 4) {
        const token = tempArr[1].substring(0, tempArr[1].indexOf("&"));
        const id = tempArr[2].substring(0, tempArr[2].indexOf("&"));
        this.setUserInfo(token, id);
        const verified = tempArr[3].substring(0, 4);
        if (verified != 'true') {
          this.router.navigate(['/google']);
        }
      }
    }
  }
}