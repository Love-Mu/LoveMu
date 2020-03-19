import { Injectable } from '@angular/core';
import { User } from './users/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private cookieService:CookieService, private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('https://lovemu.compsoc.ie/profiles', { withCredentials: true });
  }

  getUser(id): Observable<User> { 
    return this.http.get<User>('https://lovemu.compsoc.ie/profiles/' + id, { withCredentials: true });
  }

  public getCurrentUser(): string {
    const userData = this.cookieService.get('id');
    if (userData) {
      const usr = JSON.parse(userData);
      const id = usr.id;
      return id;
    }
  }
}
