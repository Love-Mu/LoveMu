import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
//import { NavbarComponent } from './navbar/navbar.component'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public usrAuthed: boolean;

  constructor(private http: HttpClient, private router: Router) { }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (token && this.http.get('https://lovemu.compsoc.ie/auth/query')) {
      this.usrAuthed = true;
      return true;
    } else {
      this.usrAuthed = false;
      return false;
    }
  }

  public setAuth(bool): void {
    this.usrAuthed = bool;
  }

  public verify() {
    this.http.get('https://lovemu.compsoc.ie/auth/query').subscribe((res) => {
      if (!res) {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }
  
  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    this.router.navigate(['/']);
    this.usrAuthed = false;
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
      //this.navbar.changeAuth(true);
      let token = res['token'];
      let id = res['id'];
      this.setUserInfo(token, id);
      this.usrAuthed = true;
      this.router.navigate(['/']);
    });
  }
}