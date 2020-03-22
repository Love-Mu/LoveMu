import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    return this.http.post('https://lovemu.compsoc.ie/auth/login', {email, password}).subscribe((res) => {
      let token = res['token'];
      let id = res['id'];
      this.setUserInfo(token, id);
      this.router.navigate(['/']);
    });
  }
}