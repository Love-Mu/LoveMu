import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../users/User';
import { UsersService } from '../users.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  activeUser: User;
  user: User;

  constructor(public messageService: MessageService, private userService: UsersService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getUser();
    let id = this.route.snapshot.paramMap.get('id');
    if (id != null) this.getActiveUser(id);
  }

  getActiveUser(id): void {
    this.userService.getUser(id.toString()).subscribe((user) => {
      this.activeUser = user;
    });
  }

  getUser(): void {
    let id = this.userService.getCurrentUser();
    this.userService.getUser(id.toString()).subscribe((user) => {
      this.user = user;
    });
  } 

}
