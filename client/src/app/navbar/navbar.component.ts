import { Component, OnInit, Input, EventEmitter } from '@angular/core';
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
  @Input() update = new EventEmitter();
  userID: String;
  usrAuthed: boolean;

  constructor(public userService: UsersService, public authService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.userID = this.userService.getCurrentUser();
    this.usrAuthed = this.authService.isAuthenticated();
  }

  updateProfile() {
    this.update.emit(this.userID);
  }

}
