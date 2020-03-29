import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { UsersService } from '../users.service';
import { User } from './User';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[];
  breakpoint;

  constructor(private userService: UsersService, private socket: Socket) { }

  ngOnInit() {
    this.getUsers();
    this.breakpoint = (window.innerWidth <= 480) ? 1 : 6;
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 480) ? 1 : 6;
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(
      users => {this.users = users; console.log(this.users)},
      error => console.log(error)
    );
  }
}
