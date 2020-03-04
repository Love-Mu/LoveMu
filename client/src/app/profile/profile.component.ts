import { Component, OnInit } from '@angular/core';

import { User } from '../users/User';
import { UsersService } from '../users.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User;

  constructor(private route: ActivatedRoute, private userService: UsersService) { }

  ngOnInit(): void {
    this.getUser()
  }

  getUser(): void {
    let id = this.route.snapshot.paramMap.get('id');
    if (id == null) {
      id = this.userService.getCurrentUser();
    }
    this.userService.getUser(id.toString()).subscribe(user => this.user = user);
  }
}