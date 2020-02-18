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
    return this.http.get<User[]>('http://localhost:8632/profiles');
  }
}
