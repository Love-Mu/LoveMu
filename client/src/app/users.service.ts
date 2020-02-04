import { Injectable } from '@angular/core';
import { User } from './users/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {  }
  getUsers(): Observable<User[]> {
  	return this.http.get<User[]>("https://danu7.it.nuigalway.ie:8632/profile")
  }
}