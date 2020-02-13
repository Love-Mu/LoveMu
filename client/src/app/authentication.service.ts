import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  public isAuthenticated(): boolean {
    const userData = localStorage.getItem('userInfo')
    if (userData && JSON.parse(userData)) {
      return true;
    }
    return false;
  }
  
  public setUserInfo(user) {
    localStorage.setItem('userInfo', JSON.stringify(user));
  }

  public validate(email, password) {
    return this.http.post('http://danu7.it.nuigalway.ie:8632/auth/login', {email, password}, {withCredentials: true}).toPromise();
  }
}

