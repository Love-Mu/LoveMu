import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../authentication.service";
import { Observable } from "rxjs";
import { UsersService } from '../users.service'
import { User } from '../users/User';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userID: String;

  constructor(private userService: UsersService, public authService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.userID = this.userService.getCurrentUser();
  }

}
