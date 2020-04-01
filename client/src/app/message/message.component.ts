import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../users/User';
import { UsersService } from '../users.service';
import { MessageService } from '../message.service';
import { FormBuilder } from '@angular/forms';
import { Chatroom } from './Chatroom'
import { Message } from '../message/Message';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  activeUser: User;
  activeChatroom: Chatroom;
  user: User;
  messageForm;
  chatrooms: Chatroom[] = [];
  messages: Message[];

  constructor(private formBuilder: FormBuilder, public messageService: MessageService, private userService: UsersService, private route: ActivatedRoute) {
    this.messageForm = this.formBuilder.group({
      recipient: '',
      body: ''
    });
  }

  ngOnInit(): void {
    this.getUser();
    let id = this.route.snapshot.paramMap.get('id');
    if (id != null) this.getActiveUser(id);
    this.messageService.onNewMessage().subscribe(data => {
      //this.messages.unshift(data);
      this.chatrooms.forEach(c => {
        if (c.user._id == data.sender) {
          if (c.messages == null) c.messages = data;
          else c.messages.push(data);
          if (data.sender == this.activeUser._id) this.messages.push(data);
        }
      });
    });
  }

  changeActive(chatroom): void {
    this.activeChatroom = chatroom;
    this.activeUser = chatroom.user;
    this.getMessages(this.activeUser._id);
  }

  getMessages(id) {
    this.messageService.getMessages(id.toString()).subscribe(messages => {
      this.messages = messages;
      console.log(this.messages);
    });
  }

  checkActiveClass(id): boolean {
    if (id == this.route.snapshot.paramMap.get('id')) {
      return true;
    } else if (this.activeUser != null && this.activeUser._id.toString() == id) {
      return true;
    } else {
      return false;
    }
  }

  getInitChatrooms() {
    this.messageService.getInitChatrooms().subscribe(chatrooms => {
      this.chatrooms = chatrooms;
      this.chatrooms.forEach((e) => {
        e.members.forEach((m) => {
          if (m != this.user._id.toString()) {
            this.userService.getUser(m.toString()).subscribe(user => {
              e.user = user;
            });
          }
        });
      });
    });
  }

  getActiveUser(id): void {
    this.userService.getUser(id.toString()).subscribe((user) => {
      this.activeUser = user;
      this.getMessages(user._id);
    });
  }

  getUser(): void {
    let id = this.userService.getCurrentUser();
    this.userService.getUser(id.toString()).subscribe((user) => {
      this.user = user;
      this.getInitChatrooms();
    });
  } 

  onSubmit(userData) {
    userData.sender = this.user._id;
    userData.recipient = this.activeUser._id;
    this.messageService.sendMessage(userData);
  } 
}
