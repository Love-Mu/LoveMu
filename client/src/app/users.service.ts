import { Injectable } from '@angular/core';
import { User } from './users/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) {  }
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('https://lovemu.compsoc.ie/profiles');
  }

  getUser(id): Observable<User> {
    return this.http.get<User>('https://lovemu.compsoc.ie/profiles/' + id);
  }

  public getCurrentUser(): string {
    const userData = localStorage.getItem('userInfo')
    if (userData) {
      const usr = JSON.parse(userData);
      const id = usr.user;
      return id;
    }
  }
}
