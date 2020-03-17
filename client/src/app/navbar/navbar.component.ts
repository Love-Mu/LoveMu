import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../authentication.service";
import { Observable } from "rxjs";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  usrAuthed: boolean;

  constructor(public authService: AuthenticationService) {
  }

  public changeAuth(bool): void {
    this.usrAuthed = bool;
  }

  ngOnInit(): void {
      this.usrAuthed = this.authService.isAuthenticated();
  }

}
