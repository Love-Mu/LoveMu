import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../authentication.service";
import { Observable } from "rxjs";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  

  constructor(public authService: AuthenticationService) {
  }

  ngOnInit(): void {
    
  }

}
