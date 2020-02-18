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
      console.log('Authenticated');
      return true;
    }
    console.log('Not Authenticated');
    return false;
  }
  
  public setUserInfo(user) {
    localStorage.setItem('userInfo', JSON.stringify(user));
  }

  public validate(email, password) {
    return this.http.post('http://localhost:8632/auth/login', {email, password}).subscribe((res) => {
      this.setUserInfo({'user': res['user']});
    });
  }
}

