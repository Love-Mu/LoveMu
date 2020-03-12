import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../authentication.service";
import { Observable } from "rxjs";

@Component({
  selector: 'app-navbar-authenticated',
  templateUrl: './navbar-authenticated.component.html',
  styleUrls: ['./navbar-authenticated.component.css']
})
export class NavbarAuthenticatedComponent implements OnInit {
  isLoggedIn : Observable<boolean>;

  constructor(private authService: AuthenticationService) {
    this.isLoggedIn = authService.isLoggedIn();
  }

  ngOnInit(): void {
  }

}
