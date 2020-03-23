import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { User } from '../users/User';
import { UsersService } from '../users.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User;
  public isCurrentUser: boolean;

  constructor(private cookieService: CookieService, private route: ActivatedRoute, private userService: UsersService, private authService: AuthenticationService) { }


  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    let id = this.route.snapshot.paramMap.get('id');
    let currentId = this.userService.getCurrentUser();

    if (currentId == id) {
      this.isCurrentUser = true;
    }
    this.userService.getUser(id.toString()).subscribe(user => this.user = user);
  }
}
