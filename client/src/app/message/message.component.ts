import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../users/User';
import { Message } from './Message';
import { UsersService } from '../users.service';
import { MessageService } from '../message.service';
import { AuthenticationService } from '../authentication.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  user: User;
  currentUser: User;
  messages: Message[];
  messageForm;
  
  constructor(private formBuilder: FormBuilder, private cookieService: CookieService, private route: ActivatedRoute, private messageService: MessageService, private userService: UsersService, private authService: AuthenticationService) {
    this.messageForm = this.formBuilder.group({
      recipient: this.route.snapshot.paramMap.get('id'),
      sender: '',
      body: ''
    });
  }

  ngOnInit(): void {
    this.getUser();
    this.getMessages();
  }

  getMessages(): void {
    let id = this.route.snapshot.paramMap.get('id');
    this.messageService.getMessages(id.toString()).subscribe(messages => this.messages = messages);
    this.messageService.onNewMessage().subscribe(data => {
      this.messages.unshift(data);
    });
  }

  getUser(): void {
    let id = this.route.snapshot.paramMap.get('id');
    let currentId = this.userService.getCurrentUser();

    this.userService.getUser(id.toString()).subscribe(user => this.user = user);
    this.userService.getUser(currentId.toString()).subscribe(user => this.currentUser = user);
  }
  
  onSubmit(userData) {
    userData.sender = this.currentUser._id;
    if (userData.body) {
      this.messages.unshift(userData);
      this.messageService.sendMessage(userData);
      this.messageForm.reset();
    }
  }

}
