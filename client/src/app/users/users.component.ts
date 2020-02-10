import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { User } from './User';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[];
  getUsers(): void {
    this.userService.getUsers().subscribe(users => (this.users = users));
  }

  constructor(private userService: UsersService) { }
  ngOnInit() {
    this.getUsers();
  }
}
