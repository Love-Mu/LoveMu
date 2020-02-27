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

  constructor(private userService: UsersService, private socket: Socket) { }

  ngOnInit() {
    this.socket.emit('message', { message: "I Have Successfully Emitted My Message!"});
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(users => (this.users = users));
  }
}
