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
    return this.http.get<User[]>('https://lovemu.compsoc.ie/profiles');
  }

  getUser(id): Observable<User> { 
    return this.http.get<User>('https://lovemu.compsoc.ie/profiles/' + id);
  }

  public getCurrentUser(): string {
    const id = localStorage.getItem('id');
    if (id != null) return id;
    else return '';
  }

  blockUser(id) {
    this.http.get('https://lovemu.compsoc.ie/profiles/block/' + id).subscribe(() => {
      console.log("user blocked");
    });
  }

  unblockUser(id) {
    this.http.get('https://lovemu.compsoc.ie/profiles/unblock/' + id).subscribe(() => {
      console.log("user unblocked");
    });
  }
}
